document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. [수정] 푸터만 가져오기 (헤더 fetch 제거)
        const footerResponse = await fetch('footer.html');

        if (!footerResponse.ok) throw new Error('푸터 로딩 실패');

        // 2. [수정] 푸터 HTML 심기 (헤더 심기 제거)
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();
        console.log("푸터 로딩 완료");

        // ---------------------------------------------------------
        // [유지] 저자 소개(Author Widget) 동적 로딩
        // ---------------------------------------------------------
        const authorPlaceholder = document.getElementById('author-placeholder');
        
        if (authorPlaceholder) {
            console.log("✅ 태그 찾음! 저자 파일 로딩 시도 중...");
            
            const authorFile = authorPlaceholder.getAttribute('data-include');
            if (authorFile) {
                try {
                    const authorResp = await fetch(authorFile);
                    if (authorResp.ok) {
                        authorPlaceholder.innerHTML = await authorResp.text();
                        console.log(`🎉 성공: ${authorFile} 로딩 완료`);
                    } else {
                        console.error(`❌ 실패: ${authorFile} 파일을 찾을 수 없습니다.`);
                    }
                } catch (e) {
                    console.error("❌ 에러: 저자 정보 로딩 중 오류 발생", e);
                }
            }
        }
        // ---------------------------------------------------------

        // 3. 메뉴 Active 처리
        // (헤더가 이미 HTML에 존재하므로 바로 실행됩니다)
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 4. 모바일 메뉴 버튼 충돌 방지 및 이벤트 연결
        // (헤더가 HTML에 직접 있어도, main.js와의 충돌 방지를 위해 이 코드는 유지하는 것이 좋습니다)
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        if (mobileNavToggleBtn) {
            // 기존 버튼을 복제하여 기존 이벤트 연결을 끊고 새로 연결
            const newBtn = mobileNavToggleBtn.cloneNode(true);
            mobileNavToggleBtn.parentNode.replaceChild(newBtn, mobileNavToggleBtn);

            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); 

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

        // 6. main.js 로드 (푸터 및 저자 소개가 로드된 후 실행되어야 안전함)
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
