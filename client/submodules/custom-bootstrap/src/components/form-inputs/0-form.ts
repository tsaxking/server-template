
// █▀ ▄▀▄ █▀▄ █▄ ▄█ ▄▀▀ 
// █▀ ▀▄▀ █▀▄ █ ▀ █ ▄█▀ 

/**
 * Description placeholder
 *
 * @typedef {CBS_FormOptions}
 */
type CBS_FormOptions = CBS_Options & {
}



/**
 * Description placeholder
 *
 * @typedef {CBS_InputList}
 */
type CBS_InputList = {
    [key: string]: CBS_Input|CBS_InputLabelContainer;
}


type CBS_FormInputType = 'text'|'password'|'email'|'select'|'textarea'|'checkbox'|'checkbox-group'|'radio'|'file'|'range'|'color'|'date';



/**
 * Description placeholder
 *
 * @class CBS_Form
 * @typedef {CBS_Form}
 * @extends {CBS_Component}
 */
class CBS_Form extends CBS_Component {
    subcomponents: {
        container: CBS_Container;
        submit: CBS_Button;
    } = {
        container: new CBS_Container(),
        submit: new CBS_Button({
            color: 'primary', 
            attributes: {
                type: 'submit'
            }
        })
    }

    /**
     * Creates an instance of CBS_Form.
     *
     * @constructor
     * @param {?CBS_FormOptions} [options]
     */
    constructor(options?: CBS_FormOptions) {
        super(options);

        this.el = document.createElement('form');

        this.subcomponents.submit.content = 'Submit';

        this.append(this.subcomponents.container);
    }

    /**
     * Description placeholder
     *
     * @param {string} type
     * @param {CBS_Options} options
     * @returns {CBS_Input}
     */
    createInput(name: string, type: CBS_FormInputType, options?: CBS_Options): CBS_InputLabelContainer {
        let i: CBS_Input;

        switch (type) {
            case 'text':
                i = new CBS_TextInput(options);
                break;
            case 'password':
                i = new CBS_PasswordInput(options);
                break;
            case 'email':
                i = new CBS_EmailInput(options);
                break;
            case 'select':
                i = new CBS_SelectInput(options);
                break;
            case 'textarea':
                i = new CBS_TextareaInput(options);
                break;
            case 'checkbox':
                i = new CBS_Checkbox(options);
                break;
            case 'checkbox-group':
                i = new CBS_CheckboxGroup(options);
                break;
            case 'radio':
                i = new CBS_RadioGroup(options);
                break;
            case 'file':
                i = new CBS_FileInput(options);
                break;
            case 'range':
                i = new CBS_RangeInput(options);
                break;
            case 'color':
                i = new CBS_ColorInput(options);
                break;
            case 'date':
                i = new CBS_DateInput(options);
                break;
            default:
                i = new CBS_Input(options);
                break;
        }

        i.setAttribute('name', name);

        const c = new CBS_InputLabelContainer();
        c.input = i;
        c.label.text = name;

        return c;
    }


    get inputs() {
        const reduce = (acc: CBS_InputList, element: CBS_Node) => {
            if (element instanceof CBS_Input) {
                if (acc[element.getAttribute('name')]) console.warn('Duplicate input, name:', element.getAttribute('name'), 'The previous will be overwritten');
                acc[element.getAttribute('name') || ''] = element;
            } else if (element instanceof CBS_InputLabelContainer) {
                if (acc[element.input.getAttribute('name')]) console.warn('Duplicate input, name:', element.input.getAttribute('name'), 'The previous will be overwritten');
                acc[element.input.getAttribute('name') || ''] = element;
            } else if (element instanceof CBS_Element) {
                element.components.forEach(el => reduce(acc, el));
            }

            return acc;
        };

        return this.components.reduce(reduce, {} as CBS_InputList)
    }

    get value() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            acc[name || ''] = input.value;
            return acc;
        }, {} as {[key: string]: any});
    }

    get mirrorValue() {
        return Object.entries(this.inputs).reduce((acc, [name, input]) => {
            acc[name || ''] = input.mirrorValue;
            return acc;
        }, {} as {[key: string]: any});
    }

    append(...elements: CBS_NodeMap): this {
        super.append(...elements);
        elements.forEach(el => {
            if (el instanceof CBS_Input) {
                if (!el.getAttribute('name')) {
                    console.warn('CBS_Form.append: Input does not have "name" attribute');
                }
            }
        });
        return this;
    }
}


CBS.addElement('form', CBS_Form);