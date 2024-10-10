document.addEventListener('DOMContentLoaded', function () {
    const btnImageAll = document.querySelector('.btnImageAll');
    if (!btnImageAll) {
        console.error('Element with class "btnImageAll" not found.');
        return;
    }

    // 圖示位置分布
    const positions = [
        { top: '59%', left: '40%', type: 'image', src: 'images/Frame 1.jpg', animationClass: 'small-blinking' },
        { top: '55%', left: '30%', type: 'video', url: 'https://www.youtube.com/embed/Yi1E9lbmpro', animationClass: 'large-blinking' },
        { top: '55%', left: '50%', type: 'image', src: 'images/Frame 2.jpg', animationClass: 'large-blinking' },
        { top: '62%', left: '70%', type: 'video', url: 'https://www.youtube.com/embed/BhCSijjV62M', animationClass: 'large-blinking' },
        { top: '70%', left: '20%', type: 'image', src: 'images/Frame 3.jpg', animationClass: 'small-blinking' },
        { top: '63%', left: '90%', type: 'image', src: 'images/Frame 4.jpg' },
        { top: '80%', left: '69%', type: 'image', src: 'images/Frame 5.jpg' },
        { top: '85%', left: '80%', type: 'image', src: 'images/Frame 6.jpg' },
        { top: '86%', left: '10%', type: 'video', url: 'https://www.youtube.com/embed/8cVCFMUEBhY' },
        { top: '62%', left: '2%', type: 'image', src: 'images/Frame 7.jpg' },
        { top: '82%', left: '89%', type: 'video', url: 'https://www.youtube.com/embed/evMpY-e8JAI' },
        { top: '55%', left: '80%', type: 'video', url: 'https://www.youtube.com/embed/mGa89i8pCCQ' },
        { top: '79%', left: '26%', type: 'image', src: 'images/Frame 8.jpg' },
        { top: '60%', left: '57%', type: 'image', src: 'images/Frame 9.jpg' },
        { top: '60%', left: '15%', type: 'image', src: 'images/Frame 10.jpg' },
    ];

    // 創建並顯示模態框的函數
    function createAndShowModal(content) {
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.tabIndex = -1;
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
        modalDialog.style.maxWidth = '60%'; // 設置外框寬度
        modalDialog.style.maxHeight = '60%'; // 設置外框高度

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.style.width = '100%';
        modalContent.style.height = '100%';

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
        modalBody.style.width = '100%';
        modalBody.style.height = '100%';
        modalBody.style.display = 'flex';
        modalBody.style.alignItems = 'center';
        modalBody.style.justifyContent = 'center';

        modalBody.appendChild(content);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);
        document.body.appendChild(modal);

        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    // 動態生成圖示和模態框
    positions.forEach((pos, index) => {
        const element = document.createElement('div');
        element.classList.add('blinking-icons');
        if (pos.animationClass) {
            element.classList.add(pos.animationClass);
        } else {
            element.classList.add('non-blinking');
        }
        element.style.position = 'absolute';
        element.style.top = pos.top;
        element.style.left = pos.left;

        if (pos.type === 'image') {
            const img = document.createElement('img');
            img.src = 'images/heart.webp'; // heart 圖片
            img.alt = 'Image';
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const imgContent = document.createElement('img');
                imgContent.src = pos.src;
                imgContent.style.maxWidth = '100%';
                imgContent.style.maxHeight = '100%';
                createAndShowModal(imgContent);
            });
            element.appendChild(img);
        } else if (pos.type === 'video') {
            const img = document.createElement('img');
            img.src = 'images/play.webp'; // play 圖片
            img.alt = 'Play Video';
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                const iframeContainer = document.createElement('div');
                iframeContainer.style.width = '100%';
                iframeContainer.style.height = '0';
                iframeContainer.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
                iframeContainer.style.position = 'relative';

                const iframe = document.createElement('iframe');
                iframe.src = pos.url;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.border = 'none';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;

                iframeContainer.appendChild(iframe);
                createAndShowModal(iframeContainer);
            });
            element.appendChild(img);
        }

        btnImageAll.appendChild(element);
    });
});