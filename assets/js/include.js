제공해주신 include.js와 HTML 파일들을 꼼꼼히 검토했습니다.

결론부터 말씀드리면, 95% 완성되었습니다!
하지만 **"블록체인 상세 페이지에서 상단 메뉴(Blog)에 불이 들어오지 않는 문제"**가 이 코드에는 빠져 있습니다. (아까 추가했던 로직이 누락되었습니다.)

또한, HTML 파일들(blog.html, business.html 등)에 **푸터 자리(footer-placeholder)**가 제대로 준비되어 있는지 확인이 필요합니다.

완벽한 마무리를 위해 딱 두 가지만 수정하면 됩니다.

1. include.js에 "블로그 메뉴 활성화" 로직 다시 넣기
현재 코드대로라면 blog-details-1.html에 들어갔을 때, 메뉴가 blog.html과 이름이 다르기 때문에 Blog 메뉴에 불이 꺼집니다.

아래 코드가 최종 완성본입니다. (3번 Active 처리 부분에 로직을 다시 채워 넣었습니다.)

📂 assets/js/include.js (이걸로 덮어쓰세요!)

JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. 푸터 가져오기 (헤더는 HTML에 있으므로 패스)
        const footerResponse = await fetch('footer.html');
        if (!footerResponse.ok) throw new Error('푸터 로딩 실패');

        // 2. 푸터 HTML 심기
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = await footerResponse.text();
            console.log("푸터 로딩 완료");
        } else {
            console.error("❌ 에러: HTML에 'footer-placeholder' 태그가 없습니다!");
        }

        // ---------------------------------------------------------
        // 저자 소개(Author Widget) 동적 로딩
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
        // 3. [중요 수정] 메뉴 Active 처리 (블로그 상세페이지 대응 포함)
        // ---------------------------------------------------------
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            let isActive = false;

            // 조건 1: 파일명이 정확히 일치할 때 (예: business.html)
            if (href === currentPath) {
                isActive = true;
            } 
            // 조건 2: 메인 페이지 처리 (루트 경로 / 인 경우)
            else if (currentPath === '' && href === 'index.html') {
                isActive = true;
            }
            // 조건 3: [복구됨] 블로그 상세 페이지일 때 'Blog' 메뉴 활성화
            else if (currentPath.includes('blog-details') && href === 'blog.html') {
                isActive = true;
            }

            // 최종 적용
            if (isActive) {
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

        // 6. main.js 로드
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
