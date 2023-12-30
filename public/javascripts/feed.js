const navSlide = () => {
    const lines = document.querySelector('.lines');
    const nav = document.querySelector('.navLink');
    
    lines.addEventListener('click',() => {
        nav.classList.toggle('nav-active');
        
    //Line Animation
    lines.classList.toggle('toggle');
    });
   
}

navSlide();