tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            colors: {
                dark: '#0a0a0a',
                darker: '#050505',
                primary: '#00f0ff', // Neon Cyan
                secondary: '#8a2be2', // Neon Purple
                accent: '#ff0055',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-glow': 'linear-gradient(90deg, #00f0ff, #8a2be2)',
            }
        }
    }
}
