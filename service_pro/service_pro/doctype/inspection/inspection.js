// Copyright (c) 2020, jan and contributors
// For license information, please see license.txt

frappe.ui.form.on('Inspection', {
	// refresh: function(frm) {
     //    if(cur_frm.is_new()){
     //         frm.add_custom_button(__("Service Receipt Note"), () => {
     //                    get_items_from_srn(cur_frm)
     //                }, __("Get Items From"))
     //    }
	// }
});

function get_items_from_srn(cur_frm) {
    new frappe.ui.form.MultiSelectDialog({
        doctype: "Service Receipt Note Item",
        target: cur_frm,
        setters: {},
        date_field: "posting_date",
        get_query() {
            return {
                filters: { docstatus: ['!=', 2] }
            }
        },
        action(selections) {
            console.log(selections);
        }
    });

// MultiSelectDialog with custom query method
// let query_args = {
//     query:"dotted.path.to.method",
//     filters: { docstatus: ["!=", 2], supplier: "John Doe" }
// }
//
// new frappe.ui.form.MultiSelectDialog({
//     doctype: "Material Request",
//     target: this.cur_frm,
//     setters: {
//         company: "Zoot"
//     },
//     date_field: "transaction_date",
//     get_query() {
//         return query_args;
//     },
//     action(selections) {
//         console.log(selections);
//     }
// });
}