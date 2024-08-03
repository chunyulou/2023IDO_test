document.addEventListener('DOMContentLoaded', function () {
    const carouselInner = document.querySelector('#carouselRight .carousel-inner');
    const carouselIndicators = document.querySelector('#carouselRight .carousel-indicators');
    const userId = getUserId(); // 使用 cookies 獲取使用者 ID

    // 獲取初始點讚數據
    fetch(`https://two023ido-test.onrender.com/likes?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const likeCounts = data.likeCounts || {}; // 點讚數量
            const userLikes = data.userLikes || {}; // 使用者點讚狀態

            const fragmentInner = document.createDocumentFragment(); // 用於批量插入圖片項的文檔片段
            const fragmentIndicators = document.createDocumentFragment(); // 用於批量插入指示器的文檔片段

            // 動態生成圖片項和指示器
            for (let i = 1; i <= 28; i++) {
                // 創建指示器
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

                // 創建圖片項
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('carousel-item');
                if (i === 1) imageContainer.classList.add('active');

                const img = document.createElement('img');
                img.src = `/images/image${i}.png`;
                img.className = 'd-block w-100 object-fit-cover';
                img.alt = `Slide ${i}`;
                img.setAttribute('loading', 'lazy'); // 應用懶加載

                const likeOverlay = document.createElement('div');
                likeOverlay.className = 'like-overlay';
                const likeCount = likeCounts[i] || 0; // 點讚數量
                const liked = userLikes[i] || false; // 是否已點讚
                likeOverlay.innerHTML = `
                    <button class="like-button" data-image-id="${i}" data-liked="${liked}">
                        <img src="${liked ? '/images/red-heart.png' : '/images/empty-heart.png'}" alt="Like" width="30" height="30">
                    </button>
                    <div class="like-counter">${likeCount}</div>
                `;

                imageContainer.appendChild(img);
                imageContainer.appendChild(likeOverlay);
                fragmentInner.appendChild(imageContainer);
            }

            // 插入指示器和圖片項
            carouselIndicators.appendChild(fragmentIndicators);
            carouselInner.appendChild(fragmentInner);

            // 處理點讚按鈕的點擊事件
            carouselInner.addEventListener('click', function (event) {
                const target = event.target;
                if (target.tagName.toLowerCase() === 'img' && target.closest('.like-button')) {
                    const likeButton = target.closest('.like-button');
                    const imageId = likeButton.dataset.imageId;
                    let liked = likeButton.dataset.liked === 'true';
                    const newLikeStatus = !liked;

                    // Update like status and UI
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
                        .then(response => response.json())
                        .then(data => {
                            const likeCount = data.likeCount || 0;
                            const counter = likeButton.nextElementSibling;

                            // Update like count and button icon
                            counter.textContent = likeCount;
                            likeButton.innerHTML = `<img src="${newIcon}" alt="${newLikeStatus ? 'Full Heart' : 'Empty Heart'}" width="30" height="30">`;

                            // Update cookies
                            setCookie(`liked_${imageId}`, newLikeStatus, 14);
                        })
                        .catch(error => console.error('Error:', error));
                }
            });

            // 初始化 Carousel 插件
            const carousel = new bootstrap.Carousel('#carouselRight', {
                interval: 2000,
                ride: 'carousel'
            });
        })
        .catch(error => console.error('Error fetching initial data:', error));
});
