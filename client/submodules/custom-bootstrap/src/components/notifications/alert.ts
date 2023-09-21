type CBS_AlertOptions = CBS_Options & {
    color?: CBS_Color
    text?: string;
}


class CBS_Alert extends CBS_Component {
    subcomponents: {
        text: CBS_Span;
        close: CBS_Button;
    } = {
        text: new CBS_Span(),
        close: new CBS_Button({
            classes: ['btn-close'],
            attributes: {
                'data-bs-dismiss': 'alert',
                'aria-label': 'Close'
            }
        })
    }

    constructor(options?: CBS_AlertOptions) {
        super(options);

        this.addClass('d-flex', 'align-items-center', 'alert-dismissible', 'fade', 'show');
        if (options?.color) {
            this.addClass('alert-' + options.color as CBS_Class);
        }

        this.append(
            this.subcomponents.text,
            this.subcomponents.close
        );
    }

    set text(text: string) {
        this.subcomponents.text.content = text;
    }
};

CBS.addElement('alert', CBS_Alert);


// add template svg alerts
(() => {
    const alerts = {
        info: CBS_SVG.fromTemplate('info'),
        success: CBS_SVG.fromTemplate('success'),
        warning: CBS_SVG.fromTemplate('warning'),
        danger: CBS_SVG.fromTemplate('warning')
    }

    for (const [key, value] of Object.entries(alerts)) {
        const svg = new CBS_SVG();
        svg.addClass(`alert-${key}` as CBS_Class);
        svg.append(value);
        CBS_SVG.addTemplate(key, svg);
    }
})();