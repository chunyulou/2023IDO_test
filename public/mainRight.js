document.addEventListener('DOMContentLoaded', function () {
    const carouselInner = document.querySelector('#carouselRight .carousel-inner');
    const carouselIndicators = document.querySelector('#carouselRight .carousel-indicators');
    const userId = getUserId(); // 使用cookies獲取使用者id

    // 獲取初始點讚數據
    fetch(`https://two023ido-test.onrender.com/likes?userId=${userId}`)
        .then(response => {
            console.log("Fetch response status: ", response.status);
            return response.json();
        })
        .then(data => {
            console.log("Fetched data: ", data);
            const likeCounts = data.likeCounts || {};
            const userLikes = data.userLikes || {};

            // 動態生成28張右框便利貼，使用輪播功能
            const fragment = document.createDocumentFragment();// 避免網站load太久

            for (let i = 1; i <= 28; i++) {
                // Create carousel item and indicator elements
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('carousel-item');
                if (i === 1) imageContainer.classList.add('active');

                const img = document.createElement('img');
                img.src = `/images/image${i}.png`;
                img.className = 'd-block w-100 object-fit-cover';
                img.alt = `Slide ${i}`;
                img.setAttribute('loading', 'lazy'); // 避免網站load太久

                const likeOverlay = document.createElement('div');
                likeOverlay.className = 'like-overlay';
                const likeCount = likeCounts[i] || 0;
                const liked = userLikes[i] || false;
                likeOverlay.innerHTML = `
                    <button class="like-button" data-image-id="${i}" data-liked="${liked}">
                        <img src="${liked ? '/images/red-heart.png' : '/images/empty-heart.png'}" alt="Like" width="30" height="30">
                    </button>
                    <div class="like-counter">${likeCount}</div>
                `;

                imageContainer.appendChild(img);
                imageContainer.appendChild(likeOverlay);
                fragment.appendChild(imageContainer);

                // Create indicator
                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.dataset.bsTarget = '#carouselRight';
                indicator.dataset.bsSlideTo = i - 1;
                indicator.setAttribute('aria-label', `Slide ${i}`);
                if (i === 1) {
                    indicator.classList.add('active');
                    indicator.setAttribute('aria-current', 'true');
                }
                fragment.appendChild(indicator);
            }

            carouselInner.appendChild(fragment);


            // 便利貼點擊愛心功能
            carouselInner.addEventListener('click', function (event) {
                const target = event.target;

                if (target.tagName.toLowerCase() === 'img' && target.closest('.like-button')) {
                    const likeButton = target.closest('.like-button');
                    const imageId = likeButton.dataset.imageId;
                    const liked = likeButton.dataset.liked === 'true';
                    const newLikeStatus = !liked;

                    likeButton.dataset.liked = newLikeStatus;

                    const newIcon = newLikeStatus
                        ? '/images/red-heart.png'
                        : '/images/empty-heart.png';

                    fetch('https://two023ido-test.onrender.com/like', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: userId, imageId: imageId, liked: newLikeStatus }),
                    })
                        .then(response => {
                            console.log("Like response status: ", response.status);
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Like response data: ", data);
                            const likeCount = data.likeCount || 0;
                            const counter = likeButton.nextElementSibling;

                            counter.textContent = likeCount;
                            likeButton.innerHTML = `<img src="${newIcon}" alt="${newLikeStatus ? 'Full Heart' : 'Empty Heart'}" width="30" height="30">`;

                            // Update cookie
                            setCookie(`liked_${imageId}`, newLikeStatus, 14);
                        })
                        .catch(error => console.error('Error:', error));
                }
            });
        })
        .catch(error => console.error('Error fetching initial data:', error));
});
