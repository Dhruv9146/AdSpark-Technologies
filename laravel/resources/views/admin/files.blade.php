@extends('layouts.admin')

@section('admin_title', 'Upload / Delete Files System')

@section('content')

@if(session('success'))
    <div class="p-3 bg-green-100 border border-green-200 text-green-700 rounded-xl text-xs font-bold shadow-xs">
        {{ session('success') }}
    </div>
@endif

@if($errors->any())
    <div class="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
        <ul class="list-disc pl-4 space-y-0.5">
            @foreach($errors->all() as $err)
                <li>{{ $err }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="grid md:grid-cols-12 gap-8 items-start">
    
    <!-- LEFT: FILES LIST -->
    <div class="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Active Storage Files</h3>
            <span class="text-xs text-slate-500 block font-normal">Manage dynamic documents, logs, and corporate assets uploads</span>
        </div>

        <div class="space-y-2">
            @forelse($files as $file)
                <div class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                    <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-blue-50 text-brand-blue rounded-lg">
                            <i data-lucide="file" class="w-4.5 h-4.5"></i>
                        </div>
                        <div>
                            <span class="text-xs font-bold text-slate-900 block max-w-sm truncate">{{ basename($file) }}</span>
                            <span class="text-[10px] text-slate-400 font-mono block mt-0.5">path: /storage/{{ $file }}</span>
                        </div>
                    </div>

                    <form action="{{ route('admin.files.delete') }}" method="POST" onsubmit="return confirm('Confirm permanent deletion of this file?')">
                        @csrf
                        <input type="hidden" name="filepath" value="{{ $file }}">
                        <button type="submit" class="p-1.5 bg-slate-100 hover:bg-red-600 text-slate-600 hover:text-white rounded-lg transition-all" title="Delete file">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </form>
                </div>
            @empty
                <div class="p-8 text-center text-slate-400 italic text-xs font-normal">
                    No files uploaded in active storage uploads directory.
                </div>
            @endforelse
        </div>
    </div>

    <!-- RIGHT: UPLOADER -->
    <div class="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div>
            <h3 class="font-display font-bold text-base text-slate-900">Upload Assets</h3>
            <span class="text-xs text-slate-500 block font-normal font-sans">Submit images, PDF files, or documents up to 10MB</span>
        </div>

        <form action="{{ route('admin.files.upload') }}" method="POST" enctype="multipart/form-data" class="space-y-4 text-xs font-semibold text-slate-700">
            @csrf
            
            <div id="dropzone" class="border-2 border-dashed border-slate-200 hover:border-brand-blue bg-slate-50 hover:bg-blue-50/20 p-8 rounded-2xl text-center space-y-2 cursor-pointer transition-all">
                <i data-lucide="upload-cloud" class="w-10 h-10 text-slate-400 mx-auto block"></i>
                <span class="text-xs text-slate-600 block">Drag & Drop file or click to select</span>
                <span class="text-[10px] text-slate-400 font-normal block">Any corporate asset (Max. 10MB)</span>
                
                <input type="file" name="file" id="file" class="hidden" required onchange="updateFileName(this)">
            </div>
            
            <div id="file-name-display" class="hidden p-3 bg-blue-50 border border-blue-100 text-brand-blue text-xs rounded-xl font-bold">
                Selected: <span id="file-name-span"></span>
            </div>

            <button type="submit" class="w-full py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="arrow-up-circle" class="w-4 h-4"></i>
                Upload To Storage
            </button>
        </form>
    </div>

</div>

<script>
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file');
    
    dropzone.addEventListener('click', () => fileInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-brand-blue', 'bg-blue-50/20');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-brand-blue', 'bg-blue-50/20');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-brand-blue', 'bg-blue-50/20');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFileName(fileInput);
        }
    });

    function updateFileName(input) {
        if (input.files.length > 0) {
            document.getElementById('file-name-span').innerText = input.files[0].name;
            document.getElementById('file-name-display').classList.remove('hidden');
        }
    }
</script>

@endsection
