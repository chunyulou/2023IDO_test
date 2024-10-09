document.addEventListener('DOMContentLoaded', function () {
    const btnImageAll = document.querySelector('.btnImageAll');
    if (!btnImageAll) {
        console.error('Element with class "btnImageAll" not found.');
        return;
    }

    // 左框圖片影音圖示
    const imgSrcHeart = 'images/heart.jpg';
    const imgSrcPlay = 'images/play.jpg';

    // 圖示位置分布
    const positions = [
        { top: '59%', left: '40%', type: 'image', src: 'Frame 1.jpg' },
        { top: '55%', left: '30%', type: 'video', src: 'video1.mp4' },
        { top: '55%', left: '50%', type: 'image', src: 'Frame 2.jpg' },
        { top: '62%', left: '70%', type: 'video', src: 'video2.mp4' },
        { top: '67%', left: '20%', type: 'image', src: 'Frame 3.jpg' },
        { top: '63%', left: '90%', type: 'image', src: 'Frame 4.jpg' },
        { top: '80%', left: '69%', type: 'image', src: 'Frame 5.jpg' },
        { top: '85%', left: '80%', type: 'image', src: 'Frame 6.jpg' },
        { top: '86%', left: '10%', type: 'video', src: 'video3.mp4' },
        { top: '62%', left: '2%', type: 'image', src: 'Frame 7.jpg' },
        { top: '82%', left: '89%', type: 'video', src: 'video4.mp4' },
        { top: '55%', left: '80%', type: 'image', src: 'Frame 8.jpg' },
        { top: '65%', left: '10%', type: 'video', src: 'video5.mp4' },
        { top: '85%', left: '20%', type: 'image', src: 'Frame 9.jpg' },
        { top: '60%', left: '60%', type: 'image', src: 'Frame 10.jpg' }
    ];

    // 動態生成圖示和模態框
    positions.forEach((pos, index) => {
        const element = document.createElement('div');
        element.classList.add('blinking-icons');
        element.style.position = 'absolute';
        element.style.top = pos.top;
        element.style.left = pos.left;

        const imgSrc = pos.type === 'image' ? imgSrcHeart : imgSrcPlay;

        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = `Icon ${index + 1}`;

        element.dataset.bsToggle = 'modal';
        element.dataset.bsTarget = `#exampleModal${index + 1}`;

        element.classList.add(index % 2 === 0 ? 'large-blinking' : 'small-blinking');
        element.appendChild(imgElement);
        btnImageAll.appendChild(element);

        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = `exampleModal${index + 1}`;
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', `exampleModalLabel${index + 1}`);
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const modalCloseButton = document.createElement('button');
        modalCloseButton.classList.add('btn-close');
        modalCloseButton.type = 'button';
        modalCloseButton.setAttribute('data-bs-dismiss', 'modal');
        modalCloseButton.setAttribute('aria-label', 'Close');

        modalHeader.appendChild(modalCloseButton);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        if (pos.type === 'image') {
            const imgInModal = document.createElement('img');
            imgInModal.src = `images/${pos.src}`;
            imgInModal.classList.add('img-fluid');
            modalBody.appendChild(imgInModal);
        } else if (pos.type === 'video') {
            const videoInModal = document.createElement('video');
            videoInModal.src = `video/${pos.src}`;
            videoInModal.controls = true;
            videoInModal.classList.add('video-fluid');

            modalBody.appendChild(videoInModal);

            // 使用者點圖示觸發事件
            imgElement.addEventListener('click', function () {
                const modalInstance = new bootstrap.Modal(modal);
                modalInstance.show();
            });

            modal.addEventListener('shown.bs.modal', function () {
                videoInModal.play();
            });

            modal.addEventListener('hidden.bs.modal', function () {
                videoInModal.pause();
                videoInModal.currentTime = 0; // Optional: Reset video to the beginning
            });
        }

        modalContent.append(modalHeader, modalBody);
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        const idoLeftRight = document.querySelector('.IDo-LeftRight');
        if (idoLeftRight) {
            idoLeftRight.appendChild(modal);
        } else {
            console.error('Element with class "IDo-LeftRight" not found.');
        }
    });
});