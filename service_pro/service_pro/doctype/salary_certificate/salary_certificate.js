// Copyright (c) 2024, jan and contributors
// For license information, please see license.txt

frappe.ui.form.on("Salary Certificate", {
	company: function(frm) {
        if (frm.doc.company) {
            frm.set_query("employee", function() {
                return {
                    filters: {
                        company: frm.doc.company
                    }
                };
            });
        }
    },
    employee: function(frm) {
        if (frm.doc.employee) {
            // Call a server-side method to get passport and iqama numbers
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "Employee",
                    name: frm.doc.employee
                },
                callback: function(r) {
                    if (r.message) {
                        // Set the fetched values in the form fields
                        frm.set_value("passport_no", r.message.passport_number);
                        frm.set_value("iqama_no", r.message.custom_iqama_number);
                        frm.set_value("employee_name",r.message.employee_name);
                        frm.set_value("designation",r.message.designation);
                    }
                }
            });
        }
        total_amount(frm)
    },
    terms: function (frm) {
		erpnext.utils.get_terms(frm.doc.terms, frm.doc, function (r) {
			if (!r.exc) {console.log(r.message)
				frm.set_value("template", r.message);
			}
		});
	},
    amount: function(frm){
        if (frm.doc.amount){
            frappe.call({
                method: "service_pro.service_pro.doctype.salary_certificate.salary_certificate.get_amount_in_words",
                args: {
                    amount : frm.doc.amount
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value("amount_in_words", r.message);
                    }
                }
            });
                      
        }
    },
    gosi_basic_salary: function(frm) {
        total_amount(frm)
    },
    gosi_housing_allowance: function(frm) {
        total_amount(frm)
    },
    gosi_other_allowance: function(frm) {
        total_amount(frm)
    },
});
function total_amount(frm){
var total = 0;

total = frm.doc.gosi_basic_salary + frm.doc.gosi_housing_allowance + frm.doc.gosi_other_allowance

frm.set_value("amount",total );
}