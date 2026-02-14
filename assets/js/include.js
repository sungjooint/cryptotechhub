document.addEventListener('DOMContentLoaded', async () => {
    const preloader = document.querySelector('#preloader');

    try {
        // 1. 헤더와 푸터를 동시에 가져옵니다.
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (!headerResponse.ok || !footerResponse.ok) {
            throw new Error('파일 로딩 실패');
        }

        // 2. HTML 삽입
        const headerHtml = await headerResponse.text();
        const footerHtml = await footerResponse.text();

        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // 3. 현재 메뉴 활성화 (Active)
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';
        document.querySelectorAll('#navmenu a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // 4. [핵심] main.js 스크립트 로드 및 실행 대기
        await loadScript('assets/js/main.js');

        // 5. [중요] 강제로 로딩 화면 제거 (main.js가 놓친 것을 처리)
        if (preloader) {
            preloader.remove();
        }

        // 6. [추가] #about 같은 앵커가 주소에 있다면 해당 위치로 스크롤 이동
        // (헤더가 나중에 생기면서 위치가 어긋나는 것을 보정)
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1); // # 제거
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // 약간의 딜레이를 주어 레이아웃이 잡힌 뒤 이동
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }

    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        // 에러가 나도 로딩 화면은 꺼줍니다.
        if (preloader) preloader.remove();
    }
});

// 스크립트를 동적으로 로드하고 완료될 때까지 기다리는 함수
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}
