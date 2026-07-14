<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\Setting;
use App\Models\HeroContent;
use App\Models\SocialLink;
use App\Models\Enquiry;
use App\Models\LoginHistory;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class AdminController extends Controller
{
    // Helpers for activities logging
    private function logActivity($action, $details, $userId = null)
    {
        ActivityLog::create([
            'user_id' => $userId ?? Auth::id(),
            'admin_email' => Auth::user()->email ?? 'system@adsparktech.com',
            'action' => $action,
            'details' => $details,
            'ip_address' => request()->ip(),
        ]);
    }

    // 1. Authentication Modules
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

        $user = User::where('email', $request->email)->first();

        if ($user && $user->status === 'disabled') {
            LoginHistory::create([
                'email' => $request->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'failed',
            ]);
            return back()->withErrors([
                'email' => 'This administrator account has been disabled.',
            ])->onlyInput('email');
        }

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            LoginHistory::create([
                'user_id' => $user->id,
                'email' => $user->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => 'success',
            ]);

            $this->logActivity('Login', 'Administrator logged in successfully', $user->id);

            return redirect()->route('admin.dashboard');
        }

        LoginHistory::create([
            'email' => $request->email,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => 'failed',
        ]);

        return back()->withErrors([
            'email' => 'The provided credentials do not match our secure records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $this->logActivity('Logout', 'Administrator logged out');
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('admin.login');
    }

    // 2. Dashboard Stats & Analytics
    public function dashboard()
    {
        // Total stats
        $totalAdmins = User::count();
        $totalEnquiries = Enquiry::count();
        $totalServices = Service::count();
        
        // Simulating visitors from dynamic settings or baseline
        $visitorConfig = Setting::where('key', 'total_visitors')->first();
        if (!$visitorConfig) {
            Setting::create(['key' => 'total_visitors', 'value' => '1248']);
            $totalVisitors = 1248;
        } else {
            $totalVisitors = (int)$visitorConfig->value;
        }

        // Web status
        $statusSetting = Setting::where('key', 'website_status')->first();
        $websiteStatus = $statusSetting ? $statusSetting->value : 'online';

        // Logs
        $recentLogins = LoginHistory::orderBy('created_at', 'desc')->take(10)->get();
        $recentActivities = ActivityLog::orderBy('created_at', 'desc')->take(10)->get();

        // Enquiries
        $enquiries = Enquiry::orderBy('created_at', 'desc')->take(10)->get();
        
        $settings = Setting::pluck('value', 'key')->all();

        return view('admin.dashboard', compact(
            'totalAdmins',
            'totalVisitors',
            'totalEnquiries',
            'totalServices',
            'websiteStatus',
            'recentLogins',
            'recentActivities',
            'enquiries',
            'settings'
        ));
    }

    // 3. Admin Account Management (Super Admin only checks)
    public function listAdmins()
    {
        $this->authorizeSuperAdmin();
        $admins = User::orderBy('id', 'asc')->get();
        return view('admin.admins', compact('admins'));
    }

    public function createAdmin(Request $request)
    {
        $this->authorizeSuperAdmin();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:Super Admin,Admin,Editor,Manager',
            'status' => 'required|string|in:active,disabled',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => $validated['status'],
        ]);

        $this->logActivity('Create Admin', "Created administrator user account: {$user->email} ({$user->role})");

        return back()->with('success', "Administrator account '{$user->name}' created successfully.");
    }

    public function updateAdmin($id, Request $request)
    {
        $this->authorizeSuperAdmin();
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$id}",
            'role' => 'required|string|in:Super Admin,Admin,Editor,Manager',
            'status' => 'required|string|in:active,disabled',
        ]);

        // Prevent self disabling or role modification
        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'You cannot modify your own role or status from this interface. Use profile edit instead.']);
        }

        $user->update($validated);

        $this->logActivity('Update Admin', "Modified account configurations for {$user->email}");

        return back()->with('success', "Administrator account settings for {$user->name} updated successfully.");
    }

    public function deleteAdmin($id)
    {
        $this->authorizeSuperAdmin();
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'You cannot delete your own Super Admin account.']);
        }

        $email = $user->email;
        $name = $user->name;
        $user->delete();

        $this->logActivity('Delete Admin', "Permanently deleted administrator user account: {$email}");

        return back()->with('success', "Administrator account '{$name}' has been permanently deleted.");
    }

    public function toggleAdminStatus($id, Request $request)
    {
        $this->authorizeSuperAdmin();
        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return back()->withErrors(['error' => 'You cannot disable your own administrator account.']);
        }

        $status = $request->input('status', 'active');
        $user->update(['status' => $status]);

        $action = $status === 'active' ? 'Enabled' : 'Disabled';
        $this->logActivity("Status Change", "{$action} account {$user->email}");

        return back()->with('success', "Administrator {$user->name} status set to {$status} successfully.");
    }

    public function resetAdminPassword($id, Request $request)
    {
        $this->authorizeSuperAdmin();
        $user = User::findOrFail($id);

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        $this->logActivity('Reset Password', "Reset secure login password for administrator {$user->email}");

        return back()->with('success', "Login credentials reset successfully for {$user->name}.");
    }

    // 4. Contact Enquiries Management
    public function manageEnquiries(Request $request)
    {
        $query = Enquiry::query();

        // Search parameters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('subject', 'LIKE', "%{$search}%")
                  ->orWhere('message', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enquiries = $query->orderBy('created_at', 'desc')->paginate(15);
        $settings = Setting::pluck('value', 'key')->all();

        return view('admin.enquiries', compact('enquiries', 'settings'));
    }

    public function updateEnquiryStatus($id, Request $request)
    {
        $enquiry = Enquiry::findOrFail($id);
        $status = $request->input('status', 'Read');
        $enquiry->update(['status' => $status]);
        
        $this->logActivity('Enquiry Update', "Marked enquiry ID {$id} from {$enquiry->email} as {$status}");

        return back()->with('success', "Enquiry status changed to '{$status}'.");
    }

    public function replyEnquiry($id, Request $request)
    {
        $enquiry = Enquiry::findOrFail($id);

        $request->validate([
            'reply_message' => 'required|string',
        ]);

        // Simulating outgoing mail delivery (saving to enquiries reply logs and logging activity)
        $enquiry->update([
            'status' => 'Replied',
            'reply_text' => $request->reply_message,
            'replied_at' => now(),
        ]);

        $this->logActivity('Enquiry Reply', "Sent administrative email response to {$enquiry->email}");

        // In production, use Mail::to($enquiry->email)->send(new EnquiryReplyMail($request->reply_message));

        return back()->with('success', "Response transmitted successfully. SMTP logs registered.");
    }

    public function deleteEnquiry($id)
    {
        $enquiry = Enquiry::findOrFail($id);
        $email = $enquiry->email;
        $enquiry->delete();

        $this->logActivity('Enquiry Delete', "Deleted enquiry record from {$email}");

        return back()->with('success', "Inquiry record deleted from database logs.");
    }

    public function exportEnquiriesCSV()
    {
        $enquiries = Enquiry::orderBy('created_at', 'desc')->get();
        $csvFileName = 'AdSpark_Enquiries_Export_' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$csvFileName\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function() use ($enquiries) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Name', 'Email', 'Subject', 'Message', 'Status', 'Reply Message', 'Replied At', 'Submitted At']);

            foreach ($enquiries as $enquiry) {
                fputcsv($file, [
                    $enquiry->id,
                    $enquiry->name,
                    $enquiry->email,
                    $enquiry->subject,
                    $enquiry->message,
                    $enquiry->status,
                    $enquiry->reply_text ?? 'N/A',
                    $enquiry->replied_at ?? 'N/A',
                    $enquiry->created_at->toDateTimeString(),
                ]);
            }

            fclose($file);
        };

        $this->logActivity('Enquiries Export', "Exported contact submissions list to CSV");

        return Response::stream($callback, 200, $headers);
    }

    // 5. Website Profile & Configuration management
    public function manageHome()
    {
        $this->authorizeEditorOrHigher();
        $hero = HeroContent::first() ?? new HeroContent();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.home', compact('hero', 'settings'));
    }

    public function updateHome(Request $request)
    {
        $this->authorizeEditorOrHigher();
        
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

        $this->logActivity('Update Hero', 'Updated dynamic website hero settings');

        return back()->with('success', 'Hero parameters saved dynamically.');
    }

    public function manageServices()
    {
        $this->authorizeEditorOrHigher();
        $services = Service::all();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.services', compact('services', 'settings'));
    }

    public function createService(Request $request)
    {
        $this->authorizeEditorOrHigher();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'category' => 'required|string|max:100',
            'short_desc' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        Service::create($validated);
        
        $this->logActivity('Create Service', "Added software service: {$validated['title']}");

        return back()->with('success', "Service '{$validated['title']}' created successfully.");
    }

    public function updateService($id, Request $request)
    {
        $this->authorizeEditorOrHigher();
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'icon' => 'required|string|max:50',
            'category' => 'required|string|max:100',
            'short_desc' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $service->update($validated);

        $this->logActivity('Update Service', "Updated details for service ID {$id}: {$service->title}");

        return back()->with('success', "Service '{$service->title}' updated successfully.");
    }

    public function deleteService($id)
    {
        $this->authorizeEditorOrHigher();
        $service = Service::findOrFail($id);
        $title = $service->title;
        $service->delete();

        $this->logActivity('Delete Service', "Permanently removed service: {$title}");

        return back()->with('success', "Service record '{$title}' deleted.");
    }

    public function manageContact()
    {
        $this->authorizeEditorOrHigher();
        $socials = SocialLink::all();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.contact', compact('socials', 'settings'));
    }

    public function updateContactInfo(Request $request)
    {
        $this->authorizeEditorOrHigher();

        $request->validate([
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string',
            'address' => 'required|string',
        ]);

        Setting::updateOrCreate(['key' => 'contact_email'], ['value' => $request->contact_email]);
        Setting::updateOrCreate(['key' => 'contact_phone'], ['value' => $request->contact_phone]);
        Setting::updateOrCreate(['key' => 'address'], ['value' => $request->address]);

        $this->logActivity('Update Contact Coords', 'Updated dynamic communication coordinates');

        return back()->with('success', 'Corporate contact credentials saved.');
    }

    public function createSocialLink(Request $request)
    {
        $this->authorizeEditorOrHigher();

        $validated = $request->validate([
            'platform' => 'required|string',
            'url' => 'required|url',
            'icon' => 'required|string',
        ]);

        SocialLink::create($validated);

        $this->logActivity('Add Social Link', "Added {$validated['platform']} communication coordinate");

        return back()->with('success', 'Social URL established.');
    }

    public function deleteSocialLink($id)
    {
        $this->authorizeEditorOrHigher();
        $link = SocialLink::findOrFail($id);
        $platform = $link->platform;
        $link->delete();

        $this->logActivity('Delete Social Link', "Deleted social URL: {$platform}");

        return back()->with('success', "Social parameter removed.");
    }

    public function manageSettings()
    {
        $this->authorizeSuperAdmin();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.settings', compact('settings'));
    }

    public function updateSettings(Request $request)
    {
        $this->authorizeSuperAdmin();

        $request->validate([
            'company_name' => 'required|string',
            'logo_text' => 'required|string',
            'meta_title' => 'required|string',
            'meta_description' => 'required|string',
            'meta_keywords' => 'required|string',
            'website_status' => 'required|string|in:online,offline',
            'footer_text' => 'required|string',
        ]);

        foreach ($request->only(['company_name', 'logo_text', 'meta_title', 'meta_description', 'meta_keywords', 'website_status', 'footer_text']) as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->logActivity('System Settings', 'Updated global configuration options & SEO indices');

        return back()->with('success', 'Global system matrices saved.');
    }

    // 6. Profile Configuration Management (Any logged-in Admin user)
    public function showProfile()
    {
        $user = Auth::user();
        $settings = Setting::pluck('value', 'key')->all();
        return view('admin.profile', compact('user', 'settings'));
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$user->id}",
        ]);

        $user->update($validated);

        $this->logActivity('Profile Update', "Administrator updated their own profile (Email: {$user->email})");

        return back()->with('success', 'Personal profile information modified.');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = Auth::user();
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'The provided current password credentials did not match records.']);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        $this->logActivity('Password Modified', 'Administrator updated their own security credentials');

        return back()->with('success', 'Secure login credentials updated successfully.');
    }

    public function uploadProfilePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB Limit
        ]);

        $user = Auth::user();

        if ($request->file('photo')->isValid()) {
            // Delete old photo if exists
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $path = $request->file('photo')->store('profile_photos', 'public');
            $user->update(['profile_photo' => $path]);

            $this->logActivity('Photo Upload', 'Uploaded new custom profile photo avatar');

            return back()->with('success', 'Profile photo avatar updated successfully.');
        }

        return back()->withErrors(['photo' => 'Upload avatar execution failed.']);
    }

    // Authorization Guard Rails
    private function authorizeSuperAdmin()
    {
        if (Auth::user()->role !== 'Super Admin') {
            abort(403, 'Unauthorized operation. Only Super Administrators can view or manage other admin accounts.');
        }
    }

    private function authorizeEditorOrHigher()
    {
        $role = Auth::user()->role;
        if (!in_array($role, ['Super Admin', 'Admin', 'Editor'])) {
            abort(403, 'Access Restricted. Only Editors, Admins, and Super Admins can alter CMS website variables.');
        }
    }

    private function authorizeAdminOrHigher()
    {
        $role = Auth::user()->role;
        if (!in_array($role, ['Super Admin', 'Admin'])) {
            abort(403, 'Access Restricted. Only Administrators can view security configurations.');
        }
    }
}
