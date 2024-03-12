(function($) {
    "use strict";

    if ($('#pxp-calculator-chart').length > 0) {
        var calculatorChartElem = document.getElementById('pxp-calculator-chart').getContext('2d');
        var calculatorChart = new Chart(calculatorChartElem, {
            type: 'doughnut',
            data: {
                labels: [main_vars.interest, main_vars.taxes, main_vars.hoa_dues],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(75, 154, 217, 1)', 'rgba(153, 198, 233, 1)'],
                    borderWidth: [2, 2, 2],
                    hoverBackgroundColor: ['rgba(0, 112, 201, 1)', 'rgba(75, 154, 217, 1)', 'rgba(153, 198, 233, 1)'],
                    hoverBorderWidth: [2, 2, 2],
                    hoverBorderColor: ['rgba(0, 112, 201, 0.10)', 'rgba(75, 154, 217, 0.10)', 'rgba(153, 198, 233, 0.10)']
                }],
            },
            options: {
                responsive: true,
                cutoutPercentage: 90,
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false,
                },
                aspectRatio: 1
            }
        });
    }

    function updateCalculatorInfo() {
        var term           = $('#pxp-calculator-form-term').val();
        var interest       = $('#pxp-calculator-form-interest').val();
        var price          = $('#pxp-calculator-form-price').val();
        var downPrice      = $('#pxp-calculator-form-down-price').val();
        var downPercentage = $('#pxp-calculator-form-down-percentage').val();
        var taxes          = $('#pxp-calculator-form-property-taxes').val();
        var dues           = $('#pxp-calculator-form-hoa-dues').val();

        var termValue           = term;
        var interestValue       = interest.replace('%', '');
        var priceValue          = price.replace(/\D+/g, '');
        var downPriceValue      = downPrice;
        var downPercentageValue = downPercentage.replace('%', '');
        var taxesValue          = taxes.replace(/\D+/g, '');
        var duesValue           = dues.replace(/\D+/g, '');

        var dpa   = parseFloat(downPercentageValue) * parseFloat(priceValue) / 100;
        var ma    = parseFloat(priceValue) - dpa;
        var r     = parseFloat(interestValue) / 12 / 100;
        var n     = parseFloat(termValue) * 12;
        var tmp   = Math.round(ma * (r * Math.pow((1 + r), n)) / (Math.pow((1 + r), n) - 1));
        var total = tmp + parseFloat(taxesValue) + parseFloat(duesValue);

        if (main_vars.currency_pos == 'before') {
            $('#pxp-calculator-data-pi').text(main_vars.currency + tmp.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        } else {
            $('#pxp-calculator-data-pi').text(tmp.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency);
        }
        $('#pxp-calculator-data-pt').text(taxes);
        $('#pxp-calculator-data-hd').text(dues);
        if (main_vars.currency_pos == 'before') {
            $('.pxp-calculator-chart-result-sum').text(main_vars.currency + total.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        } else {
            $('.pxp-calculator-chart-result-sum').text(total.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency);
        }

        calculatorChart.data.datasets[0].data = [tmp, taxesValue, duesValue];
        calculatorChart.update();
    }

    if ($('.pxp-calculator-form').length > 0) {
        var price          = $('#pxp-calculator-form-price').val();
        var downPercentage = $('#pxp-calculator-form-down-percentage').val();

        var priceValue = price.replace(/\D+/g, '');
        var downPrice = Math.round(parseFloat(downPercentage) * parseFloat(priceValue) / 100);
        var newDownPrice = '';

        if (main_vars.currency_pos == 'before') {
            newDownPrice = main_vars.currency + downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
            newDownPrice = downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency;
        }

        $('#pxp-calculator-form-down-price').val(newDownPrice);

        updateCalculatorInfo();
    }

    $('.pxp-form-control-transform').focus(function() {
        var self_ = $(this);
        var inputValue = self_.val();
        var dataType = self_.attr('data-type');
        var newInputValue;

        if (dataType == 'currency') {
            newInputValue = inputValue.replace(/\D+/g, '');
        } else if (dataType == 'percent') {
            newInputValue = inputValue.replace('%', '');
        }

        self_.val(newInputValue);
        self_.attr('type', 'number');

        if (dataType == 'percent') {
            self_.attr('min', '0');
            self_.attr('max', '100');
        }
    });

    $('.pxp-form-control-transform').blur(function() {
        var self_ = $(this);
        var inputValue = self_.val();
        var dataType = self_.attr('data-type');
        var newInputValue;

        if (dataType == 'currency') {
            if (main_vars.currency_pos == 'before') {
                newInputValue = main_vars.currency + inputValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            } else {
                newInputValue = inputValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency;
            }
        } else if (dataType == 'percent') {
            newInputValue = inputValue.replace(/\,/g, '.') + '%';
        }

        self_.attr('type', 'text');

        if (dataType == 'percent') {
            self_.removeAttr('min');
            self_.removeAttr('max');
        }

        self_.val(newInputValue);
    });

    $('#pxp-calculator-form-down-price').on('keyup change', function() {
        var price     = $('#pxp-calculator-form-price').val();
        var downPrice = $(this).val();

        var priceValue = price.replace(/\D+/g, '');
        var downPercentage = (parseFloat(downPrice) * 100 / parseFloat(priceValue)).toFixed(2);
        var newDownPercentage = downPercentage.toString() + '%';

        $('#pxp-calculator-form-down-percentage').val(newDownPercentage);

        updateCalculatorInfo();
    });

    $('#pxp-calculator-form-down-percentage').on('keyup change', function() {
        var price          = $('#pxp-calculator-form-price').val();
        var downPercentage = $(this).val();

        var priceValue = price.replace(/\D+/g, '');
        var downPrice = Math.round(parseFloat(downPercentage) * parseFloat(priceValue) / 100);
        var newDownPrice = '';

        if (main_vars.currency_pos == 'before') {
            newDownPrice = main_vars.currency + downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
            newDownPrice = downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency;
        }

        $('#pxp-calculator-form-down-price').val(newDownPrice);

        updateCalculatorInfo();
    });

    $('#pxp-calculator-form-price').on('keyup change', function() {
        var price          = $(this).val();
        var downPercentage = $('#pxp-calculator-form-down-percentage').val();

        var priceValue = price.replace(/\D+/g, '');
        var downPrice = Math.round(parseFloat(downPercentage) * parseFloat(priceValue) / 100);
        var newDownPrice = '';

        if (main_vars.currency_pos == 'before') {
            newDownPrice = main_vars.currency + downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
            newDownPrice = downPrice.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + main_vars.currency;
        }

        $('#pxp-calculator-form-down-price').val(newDownPrice);

        updateCalculatorInfo();
    });

    $('#pxp-calculator-form-interest').on('keyup change', function() {
        updateCalculatorInfo();
    });

    $('#pxp-calculator-form-term').on('change', function() {
        updateCalculatorInfo();
    });
})(jQuery);