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
            
            // 모든 링크에서 active 클래스 제거
            navLinks.forEach(link => link.classList.remove('active'));
            // 클릭된 링크에 active 클래스 추가
            this.classList.add('active');
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
    });
});
