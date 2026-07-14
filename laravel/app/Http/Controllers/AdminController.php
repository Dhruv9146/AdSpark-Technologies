<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\Setting;
use App\Models\HeroContent;
use App\Models\SocialLink;
use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // 1. Authentication
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our secure records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }

    // 2. Dashboard Stats & Enquiry list
    public function dashboard()
    {
        $enquiries = Enquiry::orderBy('created_at', 'desc')->get();
        $totalEnquiries = Enquiry::count();
        $totalServices = Service::count();
        $settings = Setting::pluck('value', 'key')->all();

        return view('admin.dashboard', compact('enquiries', 'totalEnquiries', 'totalServices', 'settings'));
    }

    // Update status of enquiry
    public function updateEnquiryStatus($id, Request $request)
    {
        $enquiry = Enquiry::findOrFail($id);
        $enquiry->update(['status' => $request->input('status', 'Read')]);
        return back()->with('success', 'Enquiry status updated successfully.');
    }

    // Delete an enquiry
    public function deleteEnquiry($id)
    {
        $enquiry = Enquiry::findOrFail($id);
        $enquiry->delete();
        return back()->with('success', 'Enquiry deleted successfully.');
    }

    // 3. Manage Home Page / Hero content
    public function manageHome()
    {
        $hero = HeroContent::first() ?? new HeroContent();
        return view('admin.home', compact('hero'));
    }

    public function updateHome(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'cta_text' => 'required|string|max:255',
            'cta_link' => 'required|string|max:255',
        ]);

        $hero = HeroContent::first() ?? new HeroContent();
        $hero->title = $request->title;
        $hero->subtitle = $request->subtitle;
        $hero->cta_text = $request->cta_text;
        $hero->cta_link = $request->cta_link;
        $hero->save();

        return back()->with('success', 'Hero Content updated dynamically.');
    }

    // 4. Manage Services Catalog (CRUD)
    public function manageServices()
    {
        $services = Service::all();
        return view('admin.services', compact('services'));
    }

    public function createService(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'category' => 'required|string|max:100',
            'short_desc' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Service::create($validated);
        return back()->with('success', 'Service created successfully.');
    }

    public function updateService($id, Request $request)
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'category' => 'required|string|max:100',
            'short_desc' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $service->update($validated);
        return back()->with('success', 'Service updated successfully.');
    }

    public function deleteService($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
        return back()->with('success', 'Service removed successfully.');
    }

    // 5. Manage Contact Information & Social Links
    public function manageContact()
    {
        $socials = SocialLink::all();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.contact', compact('socials', 'settings'));
    }

    public function updateContactInfo(Request $request)
    {
        $request->validate([
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string',
            'address' => 'required|string',
        ]);

        Setting::updateOrCreate(['key' => 'contact_email'], ['value' => $request->contact_email]);
        Setting::updateOrCreate(['key' => 'contact_phone'], ['value' => $request->contact_phone]);
        Setting::updateOrCreate(['key' => 'address'], ['value' => $request->address]);

        return back()->with('success', 'Contact coordinates updated.');
    }

    public function createSocialLink(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string',
            'url' => 'required|url',
            'icon' => 'required|string',
        ]);

        SocialLink::create($validated);
        return back()->with('success', 'Social Link added.');
    }

    public function deleteSocialLink($id)
    {
        $link = SocialLink::findOrFail($id);
        $link->delete();
        return back()->with('success', 'Social Link removed.');
    }

    // 6. Website Settings (Logo & Meta Parameters)
    public function manageSettings()
    {
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.settings', compact('settings'));
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string',
            'logo_text' => 'required|string',
            'meta_title' => 'required|string',
            'meta_description' => 'required|string',
            'meta_keywords' => 'required|string',
        ]);

        foreach ($request->only(['company_name', 'logo_text', 'meta_title', 'meta_description', 'meta_keywords']) as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Website settings and SEO tags saved.');
    }

    // 7. Change Admin Password
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Your current credentials do not match.']);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return back()->with('success', 'Admin Password changed successfully.');
    }

    // 8. Upload/Delete Files
    public function manageFiles()
    {
        // Lists all files in the uploads folder
        $files = Storage::disk('public')->files('uploads');
        return view('admin.files', compact('files'));
    }

    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB limit
        ]);

        if ($request->file('file')->isValid()) {
            $path = $request->file('file')->store('uploads', 'public');
            return back()->with('success', 'File uploaded successfully: ' . basename($path));
        }

        return back()->withErrors(['file' => 'Upload failed.']);
    }

    public function deleteFile(Request $request)
    {
        $request->validate([
            'filepath' => 'required|string',
        ]);

        if (Storage::disk('public')->exists($request->filepath)) {
            Storage::disk('public')->delete($request->filepath);
            return back()->with('success', 'File deleted successfully.');
        }

        return back()->withErrors(['file' => 'File does not exist.']);
    }
}
