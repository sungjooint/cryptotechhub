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

        // 4. [핵심 수정] 모바일 메뉴 버튼 충돌 방지
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        
        if (mobileNavToggleBtn) {
            console.log("모바일 버튼 기능 연결 중...");
            
            // 기존 버튼을 복제하여 기존 이벤트 연결(main.js 등)을 끊어버림
            const newBtn = mobileNavToggleBtn.cloneNode(true);
            mobileNavToggleBtn.parentNode.replaceChild(newBtn, mobileNavToggleBtn);

            // 새 버튼에 강력한 이벤트 리스너 부착
            newBtn.addEventListener('click', function(e) {
                // [중요] 다른 스크립트(main.js)가 이 클릭을 감지하지 못하게 막음
                e.preventDefault();
                e.stopPropagation(); 
                e.stopImmediatePropagation(); 

                console.log("모바일 버튼 클릭됨! (충돌 방지 적용)");
                
                // 메뉴 토글 실행
                document.body.classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        }

        // 5. 모바일 메뉴 링크 클릭 시 닫기
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

        // 6. main.js 로드 (애니메이션 등 다른 기능용)
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

        // 7. 로딩 화면 제거
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
