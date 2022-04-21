/**
 * @author Sławomir Kokłowski {@link http://www.kurshtml.edu.pl}
 * @copyright NIE usuwaj tego komentarza! (Do NOT remove this comment!)
 */

function Indeks(id, ramka)
{
    this.id = id;
    if (typeof ramka == 'undefined') this.ramka = self;
    else if (typeof ramka == 'string')
    {
        if (ramka == '_blank') this.ramka = '';
        else if (ramka == '_self') this.ramka = self;
        else if (ramka == '_parent') this.ramka = parent;
        else if (ramka == '_top') this.ramka = top;
        else this.ramka = ramka;
    }
    else if (!ramka) this.ramka = self;
    else this.ramka = ramka;
    
    this._szukaj = {
        html: '',
        haslo: '',
        i: 0
    };
}

Indeks.prototype.wstaw = function(hasla, adres_bazowy, rozmiar, sortuj)
{
    if (typeof sortuj != 'undefined' && sortuj)
    {
        hasla.sort(
            function(a, b)
            {
                if (a[0] == b[0]) return 0;
                return a[0].compare() < b[0].compare() ? -1 : 1;
            }
        );
    }
    if (typeof sortuj != 'undefined' && sortuj < 0)
    {
        document.write("<pre>");
        for (var i = 0; i < hasla.length; i++)
        {
            document.write("['" + hasla[i][0].addSlashes() + "','" + hasla[i][1].addSlashes() + "']" + (i < hasla.length - 1 ? ",\n" : ""));
        }
        document.write("</pre>");
    }
    else
    {
        document.write(
            '<form id="' + this.id + '" action="javascript:void(0)" onsubmit="' + this.id + '.wyswietl(); return false">' +
                '<input type="text" name="haslo" size="30" onkeyup="' + this.id + '.zaznacz()" class="text" />' +
                '<div><select name="hasla" size="' + (typeof rozmiar != 'undefined' && rozmiar ? rozmiar : 15) + '" ondblclick="' + this.id + '.wyswietl()">'
        );
        for (var i = 0; i < hasla.length; i++)
        {
            document.write('<option value="' + ((typeof adres_bazowy == 'undefined' || !adres_bazowy ? '' : adres_bazowy) + hasla[i][1]).htmlSpecialChars(true) + '"' + (i == 0 ? ' selected="selected"' : '') + '>' + hasla[i][0].htmlSpecialChars() + '</option>');
        }
        document.write(
                '</select></div>' +
                '<input type="submit" value="Wyświetl" class="button" onclick="this.form.submit()" /> <input type="button" value="Szukaj" onclick="' + this.id + '.szukaj()" class="button" />' +
            '</form>' +
            '<div id="' + this.id + '_szukaj"></div>'
        );
        
        var matches = window.location.search.match(new RegExp('[?&]' + this.id + '=([^&]+)'));
        if (matches && typeof matches[1] != 'undefined')
        {
            document.forms[this.id].elements['haslo'].value = unescape(matches[1]);
            this.zaznacz();
            this.szukaj();
        }
    }
}

Indeks.prototype.wstawWyszukiwarke = function(adres)
{
    document.write(
        '<form action="' + adres.htmlSpecialChars(true) + '" method="get" onsubmit="' + this.id + '.wyszukaj(this.action, this.elements[0].value); return false">' +
            '<input type="text" class="text" />' +
            '<input type="submit" value="Szukaj" class="button" />' +
        '</form>'
    );
}

Indeks.prototype.wyszukaj = function(adres, haslo)
{
    var search = adres.match(/#.*/);
    adres = adres.replace(/#.*/, '').replace(new RegExp('[&?]+' + this.id + '=[^&]*', 'g'), '');
    if (adres.indexOf('&') >= 0 && adres.indexOf('?') < 0) adres = adres.replace(/&/, '?');
    this.wyswietl(adres + (adres.indexOf('?') < 0 ? '?' : '&') + this.id + '=' + escape(haslo) + (search ? search : ''));
}

Indeks.prototype.wyswietl = function(adres)
{
    if (typeof adres == 'undefined') adres = document.forms[this.id].elements['hasla'].value;
    if (typeof this.ramka == 'string')
    {
        var okno = window.open(adres, this.ramka, 'menubar=yes,toolbar=yes,location=yes,directories=no,status=yes,scrollbars=yes,resizable=yes');
        if (okno) okno.focus();
        else window.location.href = adres;
    }
    else this.ramka.location.href = adres;
}

Indeks.prototype.zaznacz = function()
{
    var haslo = document.forms[this.id].elements['haslo'].value.toLowerCase();
    for (var i = 0; i < document.forms[this.id].elements['hasla'].options.length; i++)
    {
        if (document.forms[this.id].elements['hasla'].options[i].text.toLowerCase().indexOf(haslo) == 0)
        {
            document.forms[this.id].elements['hasla'].options[i].selected = true;
            break;
        }
    }
}

Indeks.prototype.szukaj = function()
{
    if (!this._szukaj.i)
    {
        if (document.forms[this.id].elements['haslo'].value == '') return;
        var haslo = document.forms[this.id].elements['haslo'].value.toLowerCase().replace(/[^a-ząćęłńóśźż_*?"]+/gi, ' ').replace(/\*/g, '[a-ząćęłńóśźż_]*').replace(/\?/g, '[a-ząćęłńóśźż_]');
        this._szukaj.haslo = haslo.match(/"[^"]+"/g);
        if (!this._szukaj.haslo) this._szukaj.haslo = new Array();
        else
        {
            for (var i = 0; i < this._szukaj.haslo.length; i++)
            {
                var pos = -1;
                var len = this._szukaj.haslo[i].length;
                while ((pos = haslo.indexOf(this._szukaj.haslo[i], pos + 1)) >= 0)
                {
                    haslo = haslo.substring(0, pos) + haslo.substring(pos + len);
                }
                this._szukaj.haslo[i] = this._szukaj.haslo[i].replace(/(^[" ]+|[" ]+$)/g, '');
            }
        }
        haslo = haslo.replace(/[" ]+/g, ' ').replace(/(^ | $)/g, '');
        if (haslo != '' && haslo != ' ')
        {
            haslo = haslo.split(' ');
            for (var i = 0; i < haslo.length; i++)
            {
                this._szukaj.haslo[this._szukaj.haslo.length] = haslo[i];
            }
        }
        var oHaslo = new Object();
        for (var i = 0; i < this._szukaj.haslo.length; i++)
        {
            oHaslo[this._szukaj.haslo[i]] = this._szukaj.haslo[i];
        }
        this._szukaj.haslo = new Array();
        for (var haslo in oHaslo)
        {
            if (haslo.length > 2) this._szukaj.haslo[this._szukaj.haslo.length] = new RegExp('(^|[^a-ząćęłńóśźż_])' + haslo + '([^a-ząćęłńóśźż_]|$)');
        }
        this._szukaj.html = '';
        if (this._szukaj.haslo.length == 0) return;
    }
    for (; this._szukaj.i < document.forms[this.id].elements['hasla'].options.length; this._szukaj.i++)
    {
        for (var j = 0; j < this._szukaj.haslo.length; j++)
        {
            if (document.forms[this.id].elements['hasla'].options[this._szukaj.i].text.toLowerCase().search(this._szukaj.haslo[j]) >= 0)
            {
                var tag = new Array('<a href="' + document.forms[this.id].elements['hasla'].options[this._szukaj.i].value.htmlSpecialChars(true) + '"' + (this.ramka ? ' onclick="' + this.id + '.wyswietl(this.href); return false"' : '') + '>', '</a>');
                var text = document.forms[this.id].elements['hasla'].options[this._szukaj.i].text.htmlSpecialChars();
                var pos = this._szukaj.html.indexOf(tag[0]);
                if (pos >= 0)
                {
                    var pos = this._szukaj.html.indexOf(tag[1], pos);
                    this._szukaj.html = this._szukaj.html.substring(0, pos) + ',<br />' + text + this._szukaj.html.substring(pos);
                }
                else this._szukaj.html += '<li>' + tag[0] + text + tag[1] + '</li>';
                break;
            }
        }
        if (this._szukaj.i && this._szukaj.i < document.forms[this.id].elements['hasla'].options.length - 1 && !(this._szukaj.i % 100))
        {
            document.getElementById(this.id + '_szukaj').innerHTML = Math.floor(this._szukaj.i / document.forms[this.id].elements['hasla'].options.length * 100) + '%';
            this._szukaj.i++;
            setTimeout(this.id + '.szukaj()', 1);
            return;
        }
    }
    document.getElementById(this.id + '_szukaj').innerHTML = '<p>Wyniki wyszukiwania: <em>' + document.forms[this.id].elements['haslo'].value.htmlSpecialChars() + '</em></p>' + (this._szukaj.html == '' ? '' : '<ol>' + this._szukaj.html + '</ol>');
    this._szukaj.i = 0;
}


String.prototype.htmlSpecialChars = function(attribute)
{
    var str = this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (typeof attribute != 'undefined' && !attribute) str = str.replace(/"/g, '&quot;');
    return str;
}
String.prototype.addSlashes = function(limiter)
{
    if (typeof limiter == 'undefined') limiter = "'";
    var regExp = new RegExp(limiter, 'g');
    return this.replace(/\\/g, '\\\\').replace(regExp, '\\' + limiter);
}
if (!String.prototype._toLowerCase)
{
    String.prototype._toLowerCase = String.prototype.toLowerCase;
    String.prototype.toLowerCase = function()
    {
        return this._toLowerCase().replace(/[ĄĆĘŁŃÓŚŹŻ]/g,
            function(str)
            {
                if (str == 'Ą') return 'ą';
                if (str == 'Ć') return 'ć';
                if (str == 'Ę') return 'ę';
                if (str == 'Ł') return 'ł';
                if (str == 'Ń') return 'ń';
                if (str == 'Ó') return 'ó';
                if (str == 'Ś') return 'ś';
                if (str == 'Ź') return 'ź';
                if (str == 'Ż') return 'ż';
                return str;
            }
        );
    }
}
String.prototype.compare = function()
{
    return this.toLowerCase().replace(/[ąćęłńóśźż]/g,
        function(str)
        {
            if (str == 'ą') return 'aż';
            if (str == 'ć') return 'cż';
            if (str == 'ę') return 'eż';
            if (str == 'ł') return 'lż';
            if (str == 'ń') return 'nż';
            if (str == 'ó') return 'oż';
            if (str == 'ś') return 'sż';
            if (str == 'ź') return 'zż';
            if (str == 'ż') return 'zżż';
            return str;
        }
    );
}
