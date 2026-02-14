document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. 헤더/푸터 가져오기
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) throw new Error('파일 로딩 실패');

        // 2. HTML 심기
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();
        console.log("헤더/푸터 로딩 완료");

        // 3. 메뉴 Active 처리
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 4. [핵심] 모바일 메뉴 버튼 기능 강제 주입
        // 헤더가 로딩된 직후에 버튼을 찾아서 클릭 이벤트를 직접 붙입니다.
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        
        if (mobileNavToggleBtn) {
            console.log("모바일 버튼 찾음: 기능 연결 중...");
            // 기존 이벤트 제거 (혹시 모를 중복 방지)
            const newBtn = mobileNavToggleBtn.cloneNode(true);
            mobileNavToggleBtn.parentNode.replaceChild(newBtn, mobileNavToggleBtn);

            newBtn.addEventListener('click', function(e) {
                console.log("모바일 버튼 클릭됨!");
                document.body.classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        } else {
            console.error("모바일 버튼을 찾을 수 없습니다. (클래스명 .mobile-nav-toggle 확인 필요)");
        }

        // 5. 모바일 메뉴 내의 링크 클릭 시 메뉴 닫기 기능 (UX 향상)
        document.querySelectorAll('#navmenu a').forEach(navLink => {
            navLink.addEventListener('click', () => {
                if (document.body.classList.contains('mobile-nav-active')) {
                    document.body.classList.remove('mobile-nav-active');
                    const toggleBtn = document.querySelector('.mobile-nav-toggle');
                    if (toggleBtn) {
                        toggleBtn.classList.toggle('bi-list');
                        toggleBtn.classList.toggle('bi-x');
                    }
                }
            });
        });

        // 6. main.js 로드 및 애니메이션 초기화
        const oldScript = document.querySelector('script[src="assets/js/main.js"]');
        if (oldScript) oldScript.remove();
        
        const script = document.createElement('script');
        script.src = 'assets/js/main.js';
        script.onload = () => {
            setTimeout(() => {
                if (typeof AOS !== 'undefined') {
                    AOS.init();
                    AOS.refresh();
                }
            }, 100);
        };
        document.body.appendChild(script);

        // 7. 로딩 화면 제거 및 앵커 이동
        setTimeout(() => {
            if (preloader) preloader.remove();
            
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 200);

    } catch (error) {
        console.error('초기화 오류:', error);
        if (preloader) preloader.remove();
    }
});
