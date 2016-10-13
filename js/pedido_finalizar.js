//ON PAGE INIT
myApp.onPageInit('pedido_finalizar', function(page) {
    $("#template_pedido_finalizar").load("templates/pedido_finalizar_template.html");
    $("#template_pedido_finalizar_enderecos").load("templates/pedido_finalizar_enderecos_template.html");
    check_token();
    //$('.btn_pedido_finalizar').on('click', pedido_finalizar);
    $("#cpf_fiscal").mask('000.000.000-00', {
        reverse: true
    });
    $("#cpf-cartao-credito").mask('000.000.000-00', {
        reverse: true
    });
    $("#nascimento-cartao-credito").mask('00/00/0000', {
        reverse: true
    });
    $("#li_troco").hide();
    $("#li_cartao_credito").hide();

    getSessionId();

    $('.btn_pedido_finalizar').on('click', function(event){
        event.preventDefault();
        pedido_finalizar();
    });


});


myApp.onPageAfterAnimation('pedido_finalizar', function(page) {
    pedido_finalizar_endereco();
    carrinho_finalizar();
});


function getSessionId() {
    var pages = $('.pages');
    var form_fechar_pedido = pages.find('#form_pedido_finalizar');
    var selectBandeiras = form_fechar_pedido.find('#bandeira-cartao-credito');
    route = "/payments/session.php";
    $.ajax({
        url: webserviceURL + route,
        dataType: 'json',
        success: function(data) {
            var idSession = data.id;
            console.log('sessionid:' + idSession);
            PagSeguroDirectPayment.setSessionId(idSession);
            PagSeguroDirectPayment.getPaymentMethods({
                success: function(response) {
                    var listaBandeiras = '';
                    $.each(response.paymentMethods.CREDIT_CARD.options, function(key, value) {
                        listaBandeiras += '<option value=' + value.name + '>' + value.name + '</option>';
                    });
                    selectBandeiras.html(listaBandeiras);
                }
            });
        }
    })
}
//Show hide troco
function add_campos() {
    if ($("#pagamento").val() == "dinheiro") {
        $("#li_troco").show();
    } else {
        $("#li_troco").hide();
    }

    if ($("#pagamento").val() == "cartao-credito") {
        $("#li_cartao_credito").show();
    } else {
        $("#li_cartao_credito").hide();
    }

    if ($("#pagamento").val() == "cartao-debito") {
        $("#li_cartao_debito").show();
    } else {
        $("#li_cartao_debito").hide();
    }
}

//Carrinho finalizar
function carrinho_finalizar() {
    data = new Object();
    data.text = JSON.parse(localStorage.carrinho);
    total = 0;
    for (i = 0; i < data.text.length; i++) {
        data.text[i].count = i;
        total += parseFloat(data.text[i].valor * data.text[i].quantidade);
    }
    total = total.toFixed(2);

    var template = $$('#template_pedido_finalizar').html();
    var compiledTemplate = Template7.compile(template);
    var html = compiledTemplate(data);
    document.getElementById("div_pedido_finalizar").innerHTML = html;

    document.getElementById("total_pedido_finalizar").innerHTML = total;
}


//Checa se usuario quer adicionar novo endereço
function pedido_finalizar_endereco_novo() {
    if ($('#div_pedido_finalizar_enderecos').val() == "novo") {
        mainView.router.loadPage('novo_endereco.html');
    }
}

//Enderecos ler
function pedido_finalizar_endereco() {
    route = "/usuario_enderecos";
    $.ajax({
        type: "GET",
        url: webserviceURL + route + "/" + localStorage.token,
        data: stringData,
        success: success,
        error: error
    });

    function success(data, status) {
        console.log(data);
        var template = $$('#template_pedido_finalizar_enderecos').html();
        var compiledTemplate = Template7.compile(template);
        var html = compiledTemplate(data);
        document.getElementById("div_pedido_finalizar_enderecos").innerHTML = html;

        if (data.text == "Erro") {
            localStorage.enderecos = 0;
        }
    }

    function error(data, status) {
        myApp.alert(text_error);
    }
}


//Checar voucher
function pedido_finalizar_voucher() {
    if ($("#voucher").val().length == 5) {
        $("#voucher").prop("readonly", true);
        voucher = $("#voucher").val();
        route = "/vouchers";
        $.ajax({
            type: "GET",
            url: webserviceURL + route + "/" + localStorage.token + "/" + localStorage.id_restaurante + "/" + voucher,
            data: stringData,
            success: success,
            error: error
        });

        function success(data, status) {
            if (data.ok > 0) {

                console.log(data);

                //Calcula o total do carrinho
                carrinho_itens = JSON.parse(localStorage.carrinho);
                total = 0;
                for (i = 0; i < carrinho_itens.length; i++) {
                    carrinho_itens[i].count = i;
                    total += parseFloat(carrinho_itens[i].valor);
                }
                total = total.toFixed(2);

                //Aplica o voucher como produto desconto
                voucher = new Object();
                voucher.id = "0";
                voucher.titulo = "VOUCHER: " + data.text[0].desconto + "% de desconto";
                voucher.valor = (total * -1 * (parseFloat(data.text[0].desconto) / 100)).toFixed(2);
                voucher.tipo = "Voucher";

                carrinho_adicionar(voucher, 1);
                carrinho_finalizar();

                myApp.alert("Voucher válidado com sucesso!");

            } else {
                $("#voucher").prop("readonly", false);
                myApp.alert(data.text);
            }
        }

        function error(data, status) {
            myApp.alert(text_error);
        }
    }
}

function pedido_finalizar(){
    if ($("#pagamento").val() == "0") {
        myApp.alert("Escolha um método de pagamento");
    } else {
        if ($("#pagamento").val() == "dinheiro") {
            if ($("#troco").val() == "") {
                myApp.alert("Informe o valor para troco.");
            } else if ($('#div_pedido_finalizar_enderecos').val() == "0") {
                myApp.alert("Escolha um endereço para entrega.");
            } else {
                var formData = myApp.formToJSON("#form_pedido_finalizar");
                formData.id_restaurante = localStorage.id_restaurante;
                formData.carrinho = JSON.parse(localStorage.carrinho);
                route = "/pedido_finalizar";
                if (JSON.parse(localStorage.carrinho).length > 0 && localStorage.id_restaurante > 0 && formData.pagamento.length > 0 && formData.id_endereco.length > 0) {
                    stringData = JSON.stringify(formData);
                    $.ajax({
                        type: "POST",
                        url: webserviceURL + route + "/" + localStorage.token,
                        data: stringData,
                        success: success,
                        error: error
                    });

                    function success(data, status) {
                        console.log(data);
                        if (data.ok == 1) {
                            mainView.router.loadPage('home.html');
                            carrinho_limpar(1);
                            myApp.alert("Pedido finalizado com sucesso!");
                            socket.emit('pedido', localStorage.token);
                        } else {
                            myApp.alert(data.text);
                        }
                    }

                    function error(data, status) {
                        myApp.alert(text_error);
                    }
                } else {
                    myApp.alert(text_fields_error);
                }
            }
        }

        if ($("#pagamento").val() == "cartao-credito") {
            if ($("#numero-cartao-credito").val() == "") {
                myApp.alert("Número do cartão é obrigatório.");
            } else if ($("#numero-cartao-credito").val().length < 16) {
                myApp.alert("Número do cartão é inválido.");
            } else if ($("#nome-cartao-credito").val() == "") {
                myApp.alert("Nome do cartão é obrigatório.");
            } else if ($("#digitos-cartao-credito").val() == "") {
                myApp.alert("Código CVV do cartão é obrigatório.");
            } else if ($("#digitos-cartao-credito").val().length < 3) {
                myApp.alert("Código CVV do cartão deve conter 3 digitos.");
            } else if ($("#digitos-cartao-credito").val().length > 3) {
                myApp.alert("Código CVV do cartão deve conter 3 digitos.");
            } else if ($("#validade-mes-cartao-credito").val() == "") {
                myApp.alert("Mês de válidade do cartão é obrigatório.");
            } else if ($("#validade-mes-cartao-credito").val().length < 2) {
                myApp.alert("Mês de válidade do cartão deve conter 2 digitos.");
            } else if ($("#validade-mes-cartao-credito").val().length > 2) {
                myApp.alert("Mês de válidade do cartão deve conter 2 digitos.");
            } else if ($("#validade-ano-cartao-credito").val() == "") {
                myApp.alert("Ano de válidade do cartão é obrigatório.");
            } else if ($("#validade-ano-cartao-credito").val().length < 4) {
                myApp.alert("Ano de válidade do cartão deve conter 4 digitos.");
            } else if ($("#validade-ano-cartao-credito").val().length > 4) {
                myApp.alert("Ano de válidade do cartão deve conter 4 digitos.");
            } else if ($("#cpf-cartao-credito").val() == "") {
                myApp.alert("CPF do cartão é obrigatório.");
            } else if ($("#cpf-cartao-credito").val().length < 14) {
                myApp.alert("CPF do cartão é inválido.");
            } else if ($('#nascimento-cartao-credito').val() == "") {
                myApp.alert("A data de nascimento do titular do cartão é obrigatória.");
            } else if ($("#nascimento-cartao-credito").val().length < 10) {
                myApp.alert("O nascimento do titular do cartão deve ser informado no seguinte formato: dd/mm/aaaa");
            } else if ($('#div_pedido_finalizar_enderecos').val() == "0") {
                myApp.alert("Escolha um endereço para entrega.");
            } else {

                var pages = $('.pages');
                var form_fechar_pedido = pages.find('#form_pedido_finalizar');
                var numero = form_fechar_pedido.find('#numero-cartao-credito').val();
                var nome = form_fechar_pedido.find('#nome-cartao-credito').val();
                var bandeira = form_fechar_pedido.find('#bandeira-cartao-credito').val();
                var codigo = form_fechar_pedido.find('#digitos-cartao-credito').val();
                var validade_mes = form_fechar_pedido.find('#validade-mes-cartao-credito').val();
                var validade_ano = form_fechar_pedido.find('#validade-ano-cartao-credito').val();
                var numeroParcelas = form_fechar_pedido.find('#parcelas-cartao-credito').val();
                var cpf_cartao = form_fechar_pedido.find('#cpf-cartao-credito').val();
                var cpf_cartao_tratado = cpf_cartao.replace(/[^\d]+/g, '');

                var hash = PagSeguroDirectPayment.getSenderHash();
                var bin = numero.substring(0, 6);
                PagSeguroDirectPayment.getBrand({
                    cardBin: bin,
                    success: function (response) {
                        var cartao = response.brand.name;
                        myApp.addNotification({
                            title: 'Aguarde enquanto verificamos os dados fornecidos do cartão.',
                            hold: 5000
                        }),
                            pegarToken(numero, cartao, codigo, validade_mes, validade_ano, hash);
                    },
                    error: function (response) {
                        var errosCartao = mostrarErros(response);
                        myApp.alert(errosCartao);
                    }
                });

                function pegarToken(numero, cartao, codigo, validade_mes, validade_ano, hash) {
                    data = new Object();
                    data.text = JSON.parse(localStorage.carrinho);
                    var total = 0;
                    for (i = 0; i < data.text.length; i++) {
                        data.text[i].count = i;
                        total += parseFloat(data.text[i].valor * data.text[i].quantidade);
                    }
                    total = total.toFixed(2);

                    PagSeguroDirectPayment.createCardToken({
                        cardNumber: numero,
                        brand: cartao,
                        cvv: codigo,
                        expirationMonth: validade_mes,
                        expirationYear: validade_ano,
                        success: function (response) {
                            console.log(total);
                            var parcelas = (numeroParcelas == 1) ? 1 : numeroParcelas;
                            fecharPedido(total, parcelas, cartao, response.card.token, hash);
                        },
                        error: function (response) {
                            var errosCartao = mostrarErros(response);
                            myApp.alert(errosCartao);
                        }
                    });
                }

                function fecharPedido(totalPagamento, parcelas, cartao, token, hash) {
                    PagSeguroDirectPayment.getInstallments({
                        amount: totalPagamento,
                        maxInstallmentNoInterest: 4,
                        brand: cartao,
                        success: function (response) {
                            var formData = myApp.formToJSON("#form_pedido_finalizar");
                            formData.id_restaurante = localStorage.id_restaurante;
                            formData.carrinho = JSON.parse(localStorage.carrinho);
                            route = '/payments/cartao-de-credito.php';
                            $.ajax({
                                url: webserviceURL+route,
                                type: 'POST',
                                data: 'tokenCartao=' + token + '&cartao=' + cartao + '&parcelas=' + parcelas + '&hash=' + hash + '&valorParcela=' + response.installments[cartao][parcelas - 1]['installmentAmount'],
                                success: function (data) {
                                    //console.log(data);
                                    if (data == 1) {
                                        myApp.alert("Seu pedido foi feito com sucesso, quando o pagseguro liberar o pagamento você será notificado e seu pedido liberado.");
                                    } else if (data == 2) {
                                        myApp.alert("Seu pagamento está em análise, quando o pagseguro liberar o pagamento você será notificado e seu pedido liberado");
                                    } else if (data == 3) {
                                        myApp.alert("Seu pagamento foi aprovado, você acabou de receber um e-mail do pagseguro confirmando o pagamento e seu pedido já foi liberado.");
                                    }
                                }
                            });
                        }, error: function (response) {
                            var errosCartao = mostrarErros(response);
                            myApp.alert(errosCartao);
                        }
                    });
                }

            }

        }

    }
}
