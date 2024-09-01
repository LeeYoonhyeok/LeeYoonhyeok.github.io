document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('section');

    // 햄버거 메뉴 클릭 시 사이드바 토글
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // 사이드바의 링크 클릭 시 사이드바 닫기 및 해당 항목 활성화
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            sidebar.classList.remove('active');

            // 모든 링크에서 active 클래스 제거
            navLinks.forEach(link => link.classList.remove('active'));
            // 클릭된 링크에 active 클래스 추가
            this.classList.add('active');

            // 클릭 시 부드럽게 스크롤
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 20, // 20px의 여유 공간을 둠
                behavior: 'smooth'
            });
        });
    });

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // 스크롤 위치가 섹션의 중앙 부분에 도달했을 때 해당 섹션을 현재 섹션으로 설정
            if (window.pageYOffset >= sectionTop - window.innerHeight / 2 &&
                window.pageYOffset < sectionTop + sectionHeight - window.innerHeight / 2) {
                current = section.getAttribute('id');
            }
        });

        // 현재 섹션에 맞는 링크를 active 상태로 변경
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
});
