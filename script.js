document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const colourBtn = document.getElementById('colourBtn');
    const variableSelect = document.getElementById('variableSelect');
    const entriesContainer = document.getElementById('entriesContainer');
    let entries = [];
    let filteredEntries = [];
    let isWhite = true;

    fileInput.addEventListener('change', handleFile);
    generateBtn.addEventListener('click', generateEntries);
    colourBtn.addEventListener('click', toggleColour);

    function handleFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            entries = jsonData.slice(1); // Remove header row
            populateVariableSelect();
        };
        reader.readAsArrayBuffer(file);
    }

    function populateVariableSelect() {
        const variables = [...new Set(entries.map(entry => entry[1]))];
        variableSelect.innerHTML = variables.map(variable => `<option value="${variable}">${variable}</option>`).join('');
    }

    function generateEntries() {
        const selectedVariable = variableSelect.value;
        filteredEntries = entries.filter(entry => entry[1] === selectedVariable);

        if (filteredEntries.length > 10) {
            filteredEntries = filteredEntries.sort(() => 0.5 - Math.random()).slice(0, 10);
        } else {
            alert('File is not uploaded or not enough entries match the selected variable.');
            return;
        }

        displayEntries();
    }

    function displayEntries() {
        entriesContainer.innerHTML = '';
        filteredEntries.forEach(entry => {
            const entryDiv = document.createElement('div');
            if (!isWhite) {
                isWhite = !isWhite
            }
            entryDiv.className = 'entry';
            entryDiv.innerHTML = `
                <span class="field">${entry[2]}</span>
                <span class="field ${isWhite ? 'white' : 'black'}">${entry[3]}</span>
            `;
            entriesContainer.appendChild(entryDiv);
        });
    }

    function toggleColour() {
        isWhite = !isWhite;
        const fields = document.querySelectorAll('.entry .field:nth-child(2)');
        fields.forEach(field => {
            field.className = `field ${isWhite ? 'white' : 'black'}`;
        });
    }
});
