// Since jQuery CDN is used inside the head section, we're waiting for the whole document to load before executing JS(jQuery)

$(document).ready(() => {
    /* Toggling Theme */
    const btnToggleTheme = $("#btnToggleTheme");

    const toggleTheme = () => {
        const theme = $('body').hasClass('dark-theme') ? 'dark-theme' : 'light-theme';
        $(':root').css('--color-bottom', `var(--${theme}-color-bottom)`);
        $(':root').css('--color-middle', `var(--${theme}-color-middle)`);
        $(':root').css('--color-top', `var(--${theme}-color-top)`);
        $(':root').css('--color-text', `var(--${theme}-color-text)`);
    };

    btnToggleTheme.on("click", () => {
        $("body").toggleClass("dark-theme");
        toggleTheme();

        // Toggle button text 
        const buttonText = $("body").hasClass("dark-theme") ? "Light Theme" : "Dark Theme";
        btnToggleTheme.text(buttonText);
    });


    /***********     ACTUAL GAME LOGIC BEGINS HERE      ************/
    
});