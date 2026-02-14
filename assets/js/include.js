document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. 헤더/푸터 파일 가져오기
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) throw new Error('파일 로딩 실패');

        // 2. HTML 심기
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();

        // 3. 메뉴 Active 처리 (현재 페이지 표시)
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 4. [중요] 모바일 메뉴 토글 기능 (이벤트 위임 방식)
        // document 자체에 이벤트를 걸어서 버튼이 늦게 생겨도 무조건 작동하게 만듭니다.
        document.body.addEventListener('click', function(e) {
            // 클릭한 요소가 .mobile-nav-toggle(삼각선 아이콘)이라면 실행
            if (e.target.matches('.mobile-nav-toggle')) {
                document.body.classList.toggle('mobile-nav-active');
                e.target.classList.toggle('bi-list');
                e.target.classList.toggle('bi-x');
            }
        });

        // 5. main.js 실행 (다른 기능들을 위해 로드)
        // 기존 main.js가 있으면 제거하고 새로 로드
        const oldScript = document.querySelector('script[src="assets/js/main.js"]');
        if (oldScript) oldScript.remove();
        
        const script = document.createElement('script');
        script.src = 'assets/js/main.js';
        document.body.appendChild(script);

        // 6. AOS 애니메이션 강제 실행 (화면이 안 나오는 문제 방지)
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.init();
                AOS.refresh();
            }
            // 로딩 화면 제거
            if (preloader) preloader.remove();
            
            // #about 등 앵커 이동
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 100); // 0.1초 딜레이 후 실행

    } catch (error) {
        console.error('초기화 오류:', error);
        if (preloader) preloader.remove();
    }
});
