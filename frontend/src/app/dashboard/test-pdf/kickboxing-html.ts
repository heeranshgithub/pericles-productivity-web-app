export const KICKBOXING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IRON FIST | Kickboxing Academy</title>
    <style>
        /* --- General Reset & Fonts --- */
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@300;400&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: #0a0a0a;
            color: #fff;
            line-height: 1.6;
            overflow-x: hidden;
        }

        h1, h2, h3 {
            font-family: 'Oswald', sans-serif;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        /* --- Navigation --- */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 10%;
            background: rgba(0,0,0,0.9);
            position: sticky;
            top: 0;
            z-index: 1000;
            border-bottom: 2px solid #e74c3c;
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #e74c3c;
        }

        .nav-links {
            list-style: none;
            display: flex;
        }

        .nav-links li {
            margin-left: 30px;
        }

        .nav-links a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            transition: 0.3s;
        }

        .nav-links a:hover {
            color: #e74c3c;
        }

        /* --- Hero Section --- */
        .hero {
            height: 90vh;
            background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), 
                        url('https://images.unsplash.com/photo-1599058917233-97f394156059?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            background-size: cover;
            background-position: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 20px;
        }

        .hero h1 {
            font-size: 5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }

        .hero p {
            font-size: 1.5rem;
            margin-bottom: 30px;
            max-width: 600px;
        }

        .btn {
            padding: 15px 40px;
            background: #e74c3c;
            color: white;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
            transition: 0.4s ease;
            text-transform: uppercase;
        }

        .btn:hover {
            background: #c0392b;
            transform: scale(1.05);
        }

        /* --- Features/Classes --- */
        .section {
            padding: 80px 10%;
            text-align: center;
        }

        .section-title {
            font-size: 2.5rem;
            margin-bottom: 50px;
            position: relative;
        }

        .section-title::after {
            content: '';
            width: 80px;
            height: 4px;
            background: #e74c3c;
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }

        .card {
            background: #1a1a1a;
            padding: 40px;
            border-radius: 10px;
            border: 1px solid #333;
            transition: 0.3s;
        }

        .card:hover {
            border-color: #e74c3c;
            transform: translateY(-10px);
        }

        .card h3 {
            margin-bottom: 15px;
            color: #e74c3c;
        }

        /* --- Footer --- */
        footer {
            background: #000;
            padding: 40px;
            text-align: center;
            border-top: 1px solid #333;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 { font-size: 3rem; }
            .nav-links { display: none; }
        }
    </style>
</head>
<body>

    <nav>
        <div class="logo">IRON FIST</div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#classes">Classes</a></li>
            <li><a href="#schedule">Schedule</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <section class="hero" id="home">
        <h1>TRAIN LIKE A PRO</h1>
        <p>Master the art of striking. Build discipline, strength, and confidence with world-class instructors.</p>
        <a href="#contact" class="btn">Start Your Trial</a>
    </section>

    <section class="section" id="classes">
        <h2 class="section-title">Our Programs</h2>
        <div class="grid">
            <div class="card">
                <h3>Muay Thai</h3>
                <p>The "Art of Eight Limbs." Learn to use knees, elbows, shins, and fists with devastating power.</p>
            </div>
            <div class="card">
                <h3>K1 Kickboxing</h3>
                <p>Fast-paced striking focusing on explosive movement, Dutch-style combinations, and footwork.</p>
            </div>
            <div class="card">
                <h3>Cardio Blast</h3>
                <p>High-intensity interval training (HIIT) combined with heavy bag work for maximum calorie burn.</p>
            </div>
        </div>
    </section>

    <section class="section" style="background-color: #111;">
        <h2 class="section-title">Why Iron Fist?</h2>
        <div class="grid">
            <div class="card" style="background: transparent; border: none;">
                <h1 style="font-size: 3rem; color: #e74c3c;">500+</h1>
                <p>Active Members</p>
            </div>
            <div class="card" style="background: transparent; border: none;">
                <h1 style="font-size: 3rem; color: #e74c3c;">12</h1>
                <p>Pro Trainers</p>
            </div>
            <div class="card" style="background: transparent; border: none;">
                <h1 style="font-size: 3rem; color: #e74c3c;">24/7</h1>
                <p>Gym Access</p>
            </div>
        </div>
    </section>

    <footer>
        <p>&copy; 2026 IRON FIST ACADEMY. No excuses, just results.</p>
    </footer>

</body>
</html>\`;`;
