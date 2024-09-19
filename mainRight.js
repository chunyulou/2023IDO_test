document.addEventListener('DOMContentLoaded', function () {
    const carouselInner = document.querySelector('#carouselRight .carousel-inner');
    const carouselIndicators = document.querySelector('#carouselRight .carousel-indicators');
    const userId = getUserId();

    fetch(`https://two023ido-test.onrender.com/likes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const likeCounts = data.likeCounts || {};
            const userLikes = data.userLikes || {};

            const fragmentInner = document.createDocumentFragment();
            const fragmentIndicators = document.createDocumentFragment();

            for (let i = 1; i <= 28; i++) {
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.dataset.bsTarget = '#carouselRight';
                indicator.dataset.bsSlideTo = i - 1;
                indicator.setAttribute('aria-label', `Slide ${i}`);
                if (i === 1) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }
                fragmentIndicators.appendChild(indicator);

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('carousel-item');
                if (i === 1) imageContainer.classList.add('active');

                const img = document.createElement('img');
                img.src = `images/image${i}.png`;
                img.className = 'd-block w-100 object-fit-cover';
                img.alt = `Slide ${i}`;
                if (i <= 3) img.setAttribute('loading', 'eager');

                const likeOverlay = document.createElement('div');
                likeOverlay.className = 'like-overlay';
                const likeCount = likeCounts[i] || 0;
                const liked = userLikes[i] || false;
                likeOverlay.innerHTML = `
                    <button class="like-button" data-image-id="${i}" data-liked="${liked}">
                        <img src="${liked ? 'images/red-heart.png' : 'images/empty-heart.png'}" alt="Like" width="30" height="30">
                    </button>
                    <div class="like-counter">${likeCount}</div>
                `;

                imageContainer.appendChild(img);
                imageContainer.appendChild(likeOverlay);
                fragmentInner.appendChild(imageContainer);
            }

            carouselIndicators.appendChild(fragmentIndicators);
            carouselInner.appendChild(fragmentInner);

            carouselInner.addEventListener('click', function (event) {
                const target = event.target;
                if (target.tagName.toLowerCase() === 'img' && target.closest('.like-button')) {
                    const likeButton = target.closest('.like-button');
                    const imageId = likeButton.dataset.imageId;
                    const liked = likeButton.dataset.liked === 'true'; // 檢查當前是否已經喜歡
                    const newLikeStatus = !liked; // 切換喜歡狀態
                    const newIcon = newLikeStatus
                        ? 'images/red-heart.png' // 如果現在喜歡，顯示紅心
                        : 'images/empty-heart.png'; // 如果現在不喜歡，顯示空心

                    fetch('https://two023ido-test.onrender.com/like', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: userId, imageId: imageId, liked: newLikeStatus }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            const likeCount = data.likeCount || 0;
                            const counter = likeButton.nextElementSibling;

                            counter.textContent = likeCount;
                            likeButton.dataset.liked = newLikeStatus; // 更新 dataset.liked 屬性
                            likeButton.innerHTML = `<img src="${newIcon}" alt="${newLikeStatus ? 'Full Heart' : 'Empty Heart'}" width="30" height="30">`;

                            setCookie(`liked_${imageId}`, newLikeStatus, 14); // 更新 Cookie
                        })
                        .catch(error => console.error('Error:', error));
                }
            });


            new bootstrap.Carousel('#carouselRight', {
                interval: 5000,
                ride: 'carousel'
            });
        })
        .catch(error => console.error('Error fetching initial data:', error));
});