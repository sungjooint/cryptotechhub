document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. 헤더와 푸터를 동시에 가져옵니다.
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) {
            throw new Error('파일을 불러오는데 실패했습니다.');
        }

        // 2. 가져온 내용을 HTML에 끼워 넣습니다.
        const headerHtml = await headerResponse.text();
        const footerHtml = await footerResponse.text();
        
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // 3. 현재 페이지 메뉴에 색상(active)을 입힙니다.
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            // 정확히 일치하거나, 루트 경로일 때 index.html 처리
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 4. [핵심] 모든 준비가 끝난 뒤에 main.js를 실행합니다.
        // 이렇게 해야 main.js가 헤더/푸터를 인식하고 애니메이션(AOS)을 작동시킵니다.
        const script = document.createElement('script');
        script.src = 'assets/js/main.js';
        document.body.appendChild(script);

    } catch (error) {
        console.error('초기화 실패:', error);
        // 에러가 나더라도 로딩 화면은 꺼줍니다.
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.remove();
    }
});