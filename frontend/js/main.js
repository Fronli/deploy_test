// Environment Configuration
const CONFIG = {
    // Local dev: backend on 5000. Will be different in prod based on BASE_URL override
    // BASE_URL: 'http://localhost:5000'
    BASE_URL: 'https://nondeafeningly-unformulistic-ciara.ngrok-free.dev'
};

document.addEventListener('DOMContentLoaded', () => {
    const loadEventsBtn = document.getElementById('load-events-btn');
    const loadEventsSpinner = document.getElementById('loading-spinner');
    const eventsContainer = document.getElementById('events-container');
    const statusMessage = document.getElementById('status-message');

    loadEventsBtn.addEventListener('click', fetchEvents);

    async function fetchEvents() {
        // UI updates for loading state
        showStatus('⏳ Loading events...', 'info');
        loadEventsBtn.disabled = true;
        loadEventsBtn.classList.add('opacity-75', 'cursor-not-allowed', 'transform-none');
        loadEventsBtn.classList.remove('hover:-translate-y-0.5', 'hover:shadow');
        loadEventsSpinner.classList.remove('hidden');
        loadEventsSpinner.classList.add('animate-spin');

        try {
            // Fetch configuration setup
            const response = await fetch(`${CONFIG.BASE_URL}/api/events`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Server returned HTTP status ${response.status}`);
            }
            
            const events = await response.json();
            
            // Artificial small delay for aesthetic transition (simulates network time)
            setTimeout(() => {
                renderEvents(events);
                hideStatus();
                // Restore button state
                resetButton();
            }, 300);
            
        } catch (error) {
            console.error('Fetch operation failed:', error);
            showStatus(`❌ Failed to fetch events: ${error.message} (Is the backend running?)`, 'error');
            clearEventsError();
            resetButton();
        }
    }

    function renderEvents(events) {
        eventsContainer.innerHTML = ''; // Clear existing
        eventsContainer.classList.remove('flex', 'flex-col', 'justify-center');
        
        if (!Array.isArray(events) || events.length === 0) {
            eventsContainer.innerHTML = `
                <div class="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                    <p>No events found at the moment.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();

        events.forEach((event, index) => {
            // Format the date properly
            const dateObj = new Date(event.date);
            const dateString = isNaN(dateObj) ? event.date : dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const card = document.createElement('div');
            // Adding a slight animation delay based on index for cascade effect
            card.className = 'bg-white border border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all duration-300 flex justify-between items-center group animate-fade-in-up';
            card.style.animationDelay = `${index * 75}ms`;
            
            card.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 tracking-tight group-hover:text-indigo-600 transition-colors">${event.name}</h3>
                        <p class="text-gray-500 font-medium text-sm mt-1 flex items-center">
                            <svg class="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            ${dateString}
                        </p>
                    </div>
                </div>
                <div class="flex-shrink-0 ml-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 group-hover:bg-indigo-50 border border-gray-200 group-hover:border-indigo-100 transition-colors">
                        ID: ${event.id}
                    </span>
                </div>
            `;
            fragment.appendChild(card);
        });

        // Add to DOM
        eventsContainer.appendChild(fragment);
    }

    function clearEventsError() {
        eventsContainer.classList.add('flex', 'flex-col', 'justify-center');
        eventsContainer.innerHTML = `
            <div class="text-red-400 italic text-center py-8 px-4 border-2 border-dashed border-red-200 bg-red-50 rounded-xl" id="empty-state">
                <p class="font-medium text-red-500 mb-1">Could not connect to the API</p>
                <p class="text-sm">Please make sure the Node.js server is running on port 5000.</p>
            </div>
        `;
    }

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'bg-blue-50', 'text-blue-700', 'border-blue-200', 'bg-red-50', 'text-red-700', 'border-red-200');
        statusMessage.classList.add('border'); // Ensure border exists
        
        if (type === 'error') {
            statusMessage.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
        } else {
            statusMessage.classList.add('bg-blue-50', 'text-blue-700', 'border-blue-200');
        }
    }

    function hideStatus() {
        statusMessage.classList.add('hidden');
    }

    function resetButton() {
        loadEventsBtn.disabled = false;
        loadEventsBtn.classList.remove('opacity-75', 'cursor-not-allowed', 'transform-none');
        loadEventsBtn.classList.add('hover:-translate-y-0.5', 'hover:shadow');
        loadEventsSpinner.classList.add('hidden');
        loadEventsSpinner.classList.remove('animate-spin');
    }
});

// For Tailwind custom animations (fade-in-up effect)
if (!document.getElementById('custom-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-styles';
    style.innerHTML = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
            opacity: 0; /* Initially hidden before animation */
        }
    `;
    document.head.appendChild(style);
}
