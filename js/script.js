document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('section');

    // 햄버거 메뉴 클릭 시 사이드바 토글
    hamburger.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });

    // 사이드바의 링크 클릭 시 사이드바 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    });

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', function() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });

        // 마지막 섹션에 도달했을 때, 해당 섹션의 링크 활성화
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            navLinks[navLinks.length - 1].classList.add('active'); // 마지막 링크 활성화
        }
    });

    // 클릭 시 부드럽게 스크롤
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 20, // 20px의 여유 공간을 둠
                behavior: 'smooth'
            });

            // 수동으로 active 상태 설정
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
