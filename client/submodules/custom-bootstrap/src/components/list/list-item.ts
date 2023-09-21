

/**
 * Options for CBS_ListItem
 *
 * @typedef {CBS_ListItemOptions}
 */
type CBS_ListItemOptions = CBS_Options & {
}


/**
 * Item for CBS_List
 *
 * @class CBS_ListItem
 * @typedef {CBS_ListItem}
 * @extends {CBS_Component}
 */
class CBS_ListItem extends CBS_Component {
    /**
     * Creates an instance of CBS_ListItem
     *
     * @constructor
     * @param {?CBS_ListItemOptions} [options]
     */
    constructor(options?: CBS_ListItemOptions) {
        super(options);

        this.options = {
            ...options,
            classes: [
                ...(options?.classes || []),
                'list-group-item'
            ],
            attributes: {
                ...options?.attributes,
                type: 'list-item'
            }
        }

        this.el = document.createElement('li');
    }
}


CBS.addElement('li', CBS_ListItem);