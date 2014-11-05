function recalculateFontUsage(coalesceSurveys, coalesceRefPeriods, coalesceFormNumbers, coalesceFormats, coalesceFontNames, coalesceFontSizes) {
    var filtered = fontUsageData.fontUsages.map(function(fontUsage, index, fontUsages) {
            var surveyIndex,
                refPeriodIndex,
                formNumberIndex,
                formatIndex,
                fontNameIndex,
                fontSizeIndex;

            surveyIndex = coalesceSurveys ? 0 : Math.floor(fontUsage / fontUsageData.surveyDivisor) % 
                fontUsageData.surveyModulus; 
            refPeriodIndex = coalesceRefPeriods ? 0 : Math.floor(fontUsage / fontUsageData.refPeriodDivisor) % 
                fontUsageData.refPeriodModulus; 
            formNumberIndex = coalesceFormNumbers ? 0 : Math.floor(fontUsage / fontUsageData.formNumberDivisor) % 
                fontUsageData.formNumberModulus; 
            formatIndex = coalesceFormats ? 0 : Math.floor(fontUsage / fontUsageData.formatDivisor) % 
                fontUsageData.formatModulus; 
            fontNameIndex = coalesceFontNames ? 0 : Math.floor(fontUsage / fontUsageData.fontNameDivisor) % 
                fontUsageData.fontNameModulus; 
            fontSizeIndex = coalesceFontSizes ? 0 : Math.floor(fontUsage / fontUsageData.fontSizeDivisor) % 
                fontUsageData.fontSizeModulus; 

            return [ surveyIndex, refPeriodIndex, formNumberIndex, formatIndex, fontNameIndex, fontSizeIndex ];
        });

    return filtered.sort(function(a, b) {
        if (a[0] !== b[0]) {
            return a[0] - b[0];
        } else if (a[1] !== b[1]) {
            return a[1] - b[1];
        } else if (a[2] !== b[2]) {
            return a[2] - b[2];
        } else if (a[3] !== b[3]) {
            return a[3] - b[3];
        } else if (a[4] !== b[4]) {
            return a[4] - b[4];
        } else {
            return a[5] - b[5];
        }
        return a - b;
    }).reduce(function(a, b) {

        function equals(aa, b) {
            return !!aa && aa.reduce(function(accum, current, index, arr) {
                return accum && (current === b[index]);
            }, true);
        }

        if (!equals(a.slice(-1)[0], b)) a.push(b);
        return a;
    }, []);
}

var surveysCoalesced = false,
    refPeriodsCoalesced = true,
    formNumbersCoalesced = true,
    formatsCoalesced = true,
    fontNamesCoalesced = false,
    fontSizesCoalesced = true;

function updateFontUsageTable() {
    var newFontUsage = recalculateFontUsage(surveysCoalesced, refPeriodsCoalesced, formNumbersCoalesced, formatsCoalesced,
        fontNamesCoalesced, fontSizesCoalesced);

    var rowsData = [];
    newFontUsage.forEach(function(element, index, arr) {
        rowsData.push([
            fontUsageData.surveys[element[0]],
            fontUsageData.refPeriods[element[1]],
            fontUsageData.formNumbers[element[2]],
            fontUsageData.formats[element[3]],
            fontUsageData.fontNames[element[4]],
            fontUsageData.fontSizes[element[5]]
        ]);
    });

    var table = $("#font-usage-table").DataTable();
    table.clear();

    table.rows.add(rowsData).columns.adjust().draw();
}

function updateButtons() {

    function updateButton(btnSelector, spanSelector, condition, action) {
        if (condition) {
            $(spanSelector).removeClass("glyphicon-minus").addClass("glyphicon-plus");
        } else {
            $(spanSelector).removeClass("glyphicon-plus").addClass("glyphicon-minus");
        }
        if (!$._data($(btnSelector)[0]).events) {
           $(btnSelector).click(action);
        }
    }

    updateButton("#sur-btn", "#sur-btn span", surveysCoalesced, function() {surveysCoalesced = !surveysCoalesced; updateAll();});
    updateButton("#ref-btn", "#ref-btn span", refPeriodsCoalesced, function() {refPeriodsCoalesced = !refPeriodsCoalesced; updateAll();});
    updateButton("#frm-btn", "#frm-btn span", formNumbersCoalesced, function() {formNumbersCoalesced = !formNumbersCoalesced; updateAll();});
    updateButton("#med-btn", "#med-btn span", formatsCoalesced, function() {formatsCoalesced = !formatsCoalesced; updateAll();});
    updateButton("#fnm-btn", "#fnm-btn span", fontNamesCoalesced, function() {fontNamesCoalesced = !fontNamesCoalesced; updateAll();});
    updateButton("#fsz-btn", "#fsz-btn span", fontSizesCoalesced, function() {fontSizesCoalesced = !fontSizesCoalesced; updateAll();});
}

function updateAll() {
    window.setTimeout(function() {
        updateButtons();
        updateFontUsageTable();
    }, 50);
}

function initialize() {

    $("document").ready(function() {
        $("#font-usage-table").DataTable({
            "bSort": false,
            "columns": [
                { "title": "<button type='button' class='btn btn-default' id='sur-btn'>" + 
                    "<strong>Survey</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" },
                { "title": "<button type='button' class='btn btn-default' id='ref-btn'>" + 
                    "<strong>Ref Period</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" },
                { "title": "<button type='button' class='btn btn-default' id='frm-btn'>" + 
                    "<strong>Form Number</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" },
                { "title": "<button type='button' class='btn btn-default' id='med-btn'>" + 
                    "<strong>Media Format</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" },
                { "title": "<button type='button' class='btn btn-default' id='fnm-btn'>" + 
                    "<strong>Font Name</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" },
                { "title": "<button type='button' class='btn btn-default' id='fsz-btn'>" + 
                    "<strong>Font Size</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>" }
            ],
        "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "aButtons": [
                "copy",
                "print",
                {
                    "sExtends":    "collection",
                    "sButtonText": "Save",
                    "aButtons":    [ "csv", "xls", "pdf" ]
                }
            ]}
        });
    });    

    updateAll();
}

initialize();