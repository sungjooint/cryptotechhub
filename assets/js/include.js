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

        // 4. 모바일 네비게이션 버튼(햄버거) 기능 살리기
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        if (mobileNavToggleBtn) {
            mobileNavToggleBtn.addEventListener('click', function(e) {
                document.querySelector('body').classList.toggle('mobile-nav-active');
                this.classList.toggle('bi-list');
                this.classList.toggle('bi-x');
            });
        }

        // 5. [핵심] main.js 실행 (비동기 로드)
        await loadScript('assets/js/main.js');

        // 6. [매우 중요] AOS 애니메이션 강제 재실행
        // 내용이 안 보이는 문제는 AOS가 초기화를 놓쳐서 발생하므로 여기서 다시 깨웁니다.
        if (typeof AOS !== 'undefined') {
            AOS.init(); 
            AOS.refresh(); 
        }

        // 7. [안전장치] 로딩 화면 강제 제거
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.remove(); }, 300); // 부드럽게 제거
        }

        // 8. #about 등 앵커 이동 처리
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            setTimeout(() => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500); // 0.5초 뒤에 이동 (화면이 다 그려진 후)
        }

    } catch (error) {
        console.error('초기화 오류:', error);
        // 에러가 나도 화면은 보여줘야 함
        if (preloader) preloader.remove();
    }
});

// 스크립트 로드 헬퍼 함수
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // 이미 스크립트가 있다면 제거하고 다시 로드 (중복 방지)
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}
