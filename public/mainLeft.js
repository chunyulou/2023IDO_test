document.addEventListener('DOMContentLoaded', function () {
    const btnImageAll = document.querySelector('.btnImageAll');
    //左框圖片影音圖示
    const imgSrcHeart = '/images/heart.png';
    const imgSrcPlay = '/images/play.png';
    //圖示位置分布
    const positions = [
        { top: '59%', left: '40%', type: 'image', src: 'Frame 1.png' },
        { top: '55%', left: '30%', type: 'video', src: 'video1.mp4' },
        { top: '55%', left: '50%', type: 'image', src: 'Frame 2.png' },
        { top: '62%', left: '70%', type: 'video', src: 'video2.mp4' },
        { top: '67%', left: '20%', type: 'image', src: 'Frame 3.png' },
        { top: '63%', left: '90%', type: 'image', src: 'Frame 4.png' },
        { top: '80%', left: '69%', type: 'image', src: 'Frame 5.png' },
        { top: '85%', left: '80%', type: 'image', src: 'Frame 6.png' },
        { top: '86%', left: '10%', type: 'video', src: 'video3.mp4' },
        { top: '62%', left: '2%', type: 'image', src: 'Frame 7.png' },
        { top: '82%', left: '89%', type: 'video', src: 'video4.mp4' },
        { top: '55%', left: '80%', type: 'image', src: 'Frame 8.png' },
        { top: '65%', left: '10%', type: 'video', src: 'video5.mp4' },
        { top: '85%', left: '20%', type: 'image', src: 'Frame 9.png' },
        { top: '60%', left: '60%', type: 'image', src: 'Frame 10.png' }
    ];
    //動態生成圖示modal功能
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

        if (index % 2 === 0) {
            element.classList.add('large-blinking');
        } else {
            element.classList.add('small-blinking');
        }

        element.appendChild(imgElement);
        btnImageAll.appendChild(element);

        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = `exampleModal${index + 1}`;
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', `exampleModalLabel${index + 1}`);
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');

        modalDialog.classList.add('modal-dialog-centered');

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
            imgInModal.src = `/images/${pos.src}`;
            imgInModal.classList.add('img-fluid');
            modalBody.appendChild(imgInModal);
        } else if (pos.type === 'video') {
            const videoInModal = document.createElement('video');
            videoInModal.src = `video/${pos.src}`;
            videoInModal.controls = true;
            videoInModal.classList.add('video-fluid');

            // 使用者點圖示觸發事件
            imgElement.addEventListener('click', function () {
                videoInModal.play();
            });

            modal.addEventListener('hidden.bs.modal', function () {
                videoInModal.pause();
            });

            modalBody.appendChild(videoInModal);
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

window.addEventListener('scroll', function () {
    var modals = document.querySelectorAll('.modal.show');
    modals.forEach(function (modal) {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var windowHeight = window.innerHeight;
        var modalHeight = modal.offsetHeight;
        modal.style.top = (scrollTop + (windowHeight - modalHeight) / 2) + 'px';
    });
});

