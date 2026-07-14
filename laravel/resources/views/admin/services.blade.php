@extends('layouts.admin')

@section('admin_title', 'Manage Tech Services Catalog')

@section('content')

@if(session('success'))
    <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
        {{ session('success') }}
    </div>
@endif

<div class="grid lg:grid-cols-12 gap-8 items-start">
    
    <!-- LEFT: SERVICES TABLE -->
    <div class="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Services Catalog</h3>
            <span class="text-xs text-slate-500 block font-normal">Directly update active public-facing service items</span>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
                <thead class="bg-slate-50 text-slate-500 uppercase tracking-widest text-[9px] border-b border-slate-200">
                    <tr>
                        <th class="p-4 font-bold">Service Title</th>
                        <th class="p-4 font-bold">Category</th>
                        <th class="p-4 font-bold">Icon Name</th>
                        <th class="p-4 font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-normal">
                    @forelse($services as $svc)
                        <tr class="hover:bg-slate-50/50">
                            <td class="p-4 font-bold text-slate-900">{{ $svc->title }}</td>
                            <td class="p-4 text-slate-500">{{ $svc->category }}</td>
                            <td class="p-4 font-mono text-slate-400">
                                <span class="flex items-center gap-1.5">
                                    <i data-lucide="{{ strtolower($svc->icon ?? 'cpu') }}" class="w-4 h-4 text-brand-blue"></i>
                                    {{ $svc->icon }}
                                </span>
                            </td>
                            <td class="p-4 text-right flex gap-2 justify-end items-center">
                                <!-- Trigger Edit by refreshing form info -->
                                <button type="button" onclick="loadEditForm({{ json_encode($svc) }})" class="p-1.5 bg-slate-100 hover:bg-brand-blue text-slate-600 hover:text-white rounded-lg transition-all" title="Edit Service">
                                    <i data-lucide="edit" class="w-3.5 h-3.5"></i>
                                </button>

                                <form action="{{ route('admin.services.delete', $svc->id) }}" method="POST" onsubmit="return confirm('Confirm deletion of this service?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white rounded-lg transition-all" title="Delete Service">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="p-8 text-center text-slate-400 italic">No services available.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <!-- RIGHT: ADD / EDIT FORM -->
    <div class="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 id="form-title" class="font-display font-bold text-base text-slate-900 mb-4">Draft New Service</h3>
        
        <form id="service-form" action="{{ route('admin.services.create') }}" method="POST" class="space-y-4 text-xs font-semibold text-slate-700">
            @csrf
            
            <input type="hidden" name="service_id" id="service_id">

            <div>
                <label for="svc_title" class="block mb-1 text-slate-500">Service Title</label>
                <input type="text" name="title" id="svc_title" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" required>
            </div>

            <div>
                <label for="svc_category" class="block mb-1 text-slate-500">Category Group</label>
                <input type="text" name="category" id="svc_category" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" placeholder="e.g. Software Engineering" required>
            </div>

            <div>
                <label for="svc_icon" class="block mb-1 text-slate-500">Lucide Icon Name</label>
                <input type="text" name="icon" id="svc_icon" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue font-mono" placeholder="Cpu, Cloud, Shield, etc." required>
            </div>

            <div>
                <label for="svc_short_desc" class="block mb-1 text-slate-500">Short Summary Card Text</label>
                <input type="text" name="short_desc" id="svc_short_desc" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue" required>
            </div>

            <div>
                <label for="svc_desc" class="block mb-1 text-slate-500">Detailed Long Description</label>
                <textarea name="description" id="svc_desc" rows="5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-brand-blue resize-none font-normal" required></textarea>
            </div>

            <button type="submit" id="submit-btn" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Add Service Slot</span>
            </button>
            
            <button type="button" id="cancel-edit-btn" onclick="resetForm()" class="hidden w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-center transition-all">
                Cancel Editing
            </button>
        </form>
    </div>

</div>

<!-- JAVASCRIPT FOR FORM SWITCHES -->
<script>
    function loadEditForm(svc) {
        document.getElementById('form-title').innerText = 'Edit Service Details';
        document.getElementById('service_id').value = svc.id;
        document.getElementById('svc_title').value = svc.title;
        document.getElementById('svc_category').value = svc.category;
        document.getElementById('svc_icon').value = svc.icon;
        document.getElementById('svc_short_desc').value = svc.short_desc;
        document.getElementById('svc_desc').value = svc.description;
        
        // Switch form action URL dynamically
        const form = document.getElementById('service-form');
        form.action = `/admin/services/${svc.id}/update`;
        
        document.getElementById('submit-btn').innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save Service Details';
        document.getElementById('cancel-edit-btn').classList.remove('hidden');
        lucide.createIcons();
    }

    function resetForm() {
        document.getElementById('form-title').innerText = 'Draft New Service';
        document.getElementById('service_id').value = '';
        document.getElementById('svc_title').value = '';
        document.getElementById('svc_category').value = '';
        document.getElementById('svc_icon').value = '';
        document.getElementById('svc_short_desc').value = '';
        document.getElementById('svc_desc').value = '';
        
        const form = document.getElementById('service-form');
        form.action = "{{ route('admin.services.create') }}";
        
        document.getElementById('submit-btn').innerHTML = '<i data-lucide="plus-circle" class="w-4 h-4"></i> Add Service Slot';
        document.getElementById('cancel-edit-btn').classList.add('hidden');
        lucide.createIcons();
    }
</script>

@endsection
