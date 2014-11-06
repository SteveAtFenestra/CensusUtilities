(function fontUsageFns() {
    "use strict";
    /*jslint browser: true*/
    /*global $, fontUsageData*/

    var surveysCoalesced = false,
        refPeriodsCoalesced = true,
        formNumbersCoalesced = true,
        formatsCoalesced = true,
        fontNamesCoalesced = false,
        fontSizesCoalesced = true,

        recalculateFontUsage,
        updateFontUsageTable,
        updateButtons,
        updateAll,
        initialize;

    recalculateFontUsage = function (coalesceSurveys, coalesceRefPeriods, coalesceFormNumbers, coalesceFormats, coalesceFontNames, coalesceFontSizes) {
        var filtered = fontUsageData.fontUsages.map(function (fontUsage) {
            var surveyIndex,
                refPeriodIndex,
                formNumberIndex,
                formatIndex,
                fontNameIndex,
                fontSizeIndex,

                filteredFontUsage;

            filteredFontUsage = fontUsage;

            fontSizeIndex = coalesceFontSizes ? 0 : filteredFontUsage % fontUsageData.fontSizeModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.fontSizeModulus);

            fontNameIndex = coalesceFontNames ? 0 : filteredFontUsage % fontUsageData.fontNameModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.fontNameModulus);

            formatIndex = coalesceFormats ? 0 : filteredFontUsage % fontUsageData.formatModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.formatModulus);

            formNumberIndex = coalesceFormNumbers ? 0 : filteredFontUsage % fontUsageData.formNumberModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.formNumberModulus);

            refPeriodIndex = coalesceRefPeriods ? 0 : filteredFontUsage % fontUsageData.refPeriodModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.refPeriodModulus);

            surveyIndex = coalesceSurveys ? 0 : filteredFontUsage % fontUsageData.surveyModulus;
            filteredFontUsage = Math.floor(filteredFontUsage / fontUsageData.surveyModulus);

            filteredFontUsage = fontSizeIndex + fontUsageData.fontSizeModulus * (
                fontNameIndex + fontUsageData.fontNameModulus * (
                    formatIndex + fontUsageData.formatModulus * (
                        formNumberIndex + fontUsageData.formNumberModulus * (
                            refPeriodIndex + fontUsageData.refPeriodModulus *
                            surveyIndex
                        )
                    )
                )
            );

            return [surveyIndex, refPeriodIndex, formNumberIndex, formatIndex, fontNameIndex, fontSizeIndex, filteredFontUsage];
        });

        return filtered.sort(function (a, b) {
            return a[6] - b[6];
        }).reduce(function (a, b) {
            var latestA = a.slice(-1)[0];
            if (!latestA || (latestA[6] !== b[6])) {
                a.push(b);
            }
            return a;
        }, []);
    };

    updateFontUsageTable = function () {
        var newFontUsage = recalculateFontUsage(surveysCoalesced, refPeriodsCoalesced, formNumbersCoalesced, formatsCoalesced,
                fontNamesCoalesced, fontSizesCoalesced),
            rowsData = [],
            table = $("#font-usage-table").DataTable();

        newFontUsage.forEach(function (element) {
            rowsData.push([
                fontUsageData.surveys[element[0]],
                fontUsageData.refPeriods[element[1]],
                fontUsageData.formNumbers[element[2]],
                fontUsageData.formats[element[3]],
                fontUsageData.fontNames[element[4]],
                fontUsageData.fontSizes[element[5]]
            ]);
        });

        table.clear();

        table.rows.add(rowsData).columns.adjust().draw();
    };

    updateButtons = function () {

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

        updateButton("#sur-btn", "#sur-btn span", surveysCoalesced, function () {
            surveysCoalesced = !surveysCoalesced;
            updateAll();
        });
        updateButton("#ref-btn", "#ref-btn span", refPeriodsCoalesced, function () {
            refPeriodsCoalesced = !refPeriodsCoalesced;
            updateAll();
        });
        updateButton("#frm-btn", "#frm-btn span", formNumbersCoalesced, function () {
            formNumbersCoalesced = !formNumbersCoalesced;
            updateAll();
        });
        updateButton("#med-btn", "#med-btn span", formatsCoalesced, function () {
            formatsCoalesced = !formatsCoalesced;
            updateAll();
        });
        updateButton("#fnm-btn", "#fnm-btn span", fontNamesCoalesced, function () {
            fontNamesCoalesced = !fontNamesCoalesced;
            updateAll();
        });
        updateButton("#fsz-btn", "#fsz-btn span", fontSizesCoalesced, function () {
            fontSizesCoalesced = !fontSizesCoalesced;
            updateAll();
        });
    };

    updateAll = function () {
        updateButtons();
        updateFontUsageTable();
    };

    initialize = function () {

        $("document").ready(function () {
            $("#font-usage-table").DataTable({
                "bSort": false,
                "columns": [{
                    "title": "<button type='button' class='btn btn-default' id='sur-btn'>" +
                        "<strong>Survey</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }, {
                    "title": "<button type='button' class='btn btn-default' id='ref-btn'>" +
                        "<strong>Ref Period</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }, {
                    "title": "<button type='button' class='btn btn-default' id='frm-btn'>" +
                        "<strong>Form Number</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }, {
                    "title": "<button type='button' class='btn btn-default' id='med-btn'>" +
                        "<strong>Media Format</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }, {
                    "title": "<button type='button' class='btn btn-default' id='fnm-btn'>" +
                        "<strong>Font Name</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }, {
                    "title": "<button type='button' class='btn btn-default' id='fsz-btn'>" +
                        "<strong>Font Size</strong>&nbsp;&nbsp;<span class='glyphicon glyphicon-minus'></span></button>"
                }]
            });
        });

        window.setTimeout(function () {
            updateAll();
        }, 50);
    };

    initialize();
}());