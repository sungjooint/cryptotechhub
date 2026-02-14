document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. 헤더/푸터 가져오기
        // (Promise.all을 사용해 병렬로 빠르게 가져옵니다)
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) throw new Error('기본 레이아웃 로딩 실패');

        // 2. 헤더/푸터 HTML 심기
        document.getElementById('header-placeholder').innerHTML = await headerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = await footerResponse.text();
        console.log("헤더/푸터 로딩 완료");




// ---------------------------------------------------------
        // [디버깅 강화] 저자 소개(Author Widget) 동적 로딩
        // ---------------------------------------------------------
        const authorPlaceholder = document.getElementById('author-placeholder');
        
        if (authorPlaceholder) {
            console.log("✅ 태그 찾음! 파일 로딩 시도 중..."); // 이 로그가 뜨나요?
            
            const authorFile = authorPlaceholder.getAttribute('data-include');
            if (authorFile) {
                try {
                    const authorResp = await fetch(authorFile);
                    if (authorResp.ok) {
                        authorPlaceholder.innerHTML = await authorResp.text();
                        console.log(`🎉 성공: ${authorFile} 로딩 완료`);
                    } else {
                        console.error(`❌ 실패: ${authorFile} 파일을 찾을 수 없습니다 (404). 파일명/위치 확인!`);
                    }
                } catch (e) {
                    console.error("❌ 에러: 저자 정보 로딩 중 오류 발생", e);
                }
            } else {
                console.warn("⚠️ 경고: data-include 속성이 비어있습니다.");
            }
        } else {
            // 콘솔에 이 메시지가 뜬다면 1번(HTML 태그 누락/오타)이 원인입니다.
            console.log("ℹ️ 알림: 이 페이지에는 'author-placeholder' 태그가 없습니다.");
        }
        // ---------------------------------------------------------








        // ---------------------------------------------------------

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

        // 4. 모바일 메뉴 버튼 충돌 방지 및 이벤트 연결
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        if (mobileNavToggleBtn) {
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

        // 6. main.js 로드 (애니메이션 등)
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
