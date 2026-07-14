<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AdSpark Technologies | Admin Login</title>
    
    <!-- Typography & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            blue: '#2563eb',
                            dark: '#0f172a'
                        }
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        display: ['Space Grotesk', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gradient-to-br from-brand-dark via-slate-900 to-slate-950 text-slate-800 font-sans min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 space-y-6 text-white shadow-2xl">
        <div class="text-center space-y-2">
            <div class="p-3 bg-brand-blue rounded-2xl w-fit mx-auto text-white shadow-lg">
                <i data-lucide="sparkles" class="w-6 h-6"></i>
            </div>
            <h1 class="text-2xl font-display font-bold">Admin Portal</h1>
            <p class="text-slate-400 text-xs">Enter your secure credentials to sign in dynamically</p>
        </div>

        @if($errors->any())
            <div class="p-4 bg-red-950/80 border border-red-900 text-red-400 rounded-xl text-xs font-semibold">
                @foreach($errors->all() as $err)
                    <p>{{ $err }}</p>
                @endforeach
            </div>
        @endif

        <form action="{{ route('admin.login.submit') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-300">
            @csrf
            
            <div>
                <label for="email" class="block mb-1 text-slate-400">Admin Email Address</label>
                <input type="email" name="email" id="email" class="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-blue" placeholder="email@example.com" value="{{ old('email', 'adsparktechnologies01@gmail.com') }}" required>
            </div>

            <div>
                <label for="password" class="block mb-1 text-slate-400">Password</label>
                <input type="password" name="password" id="password" class="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-blue" value="AdSpark@2026" required>
            </div>

            <button type="submit" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-lg hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="log-in" class="w-4 h-4"></i>
                Sign In
            </button>
        </form>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
