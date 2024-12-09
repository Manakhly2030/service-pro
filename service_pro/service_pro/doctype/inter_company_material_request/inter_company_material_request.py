from frappe.model.document import Document
import frappe

class InterCompanyMaterialRequest(Document):
    def on_submit(self):
        stock_transfer_template = None
        for item in self.get("items"):
            if item.stock_transfer_template:
                stock_transfer_template = item.stock_transfer_template
                break
        
        if not stock_transfer_template:
            frappe.throw("No stock transfer template found in items.")
        
        stock_transfer = frappe.new_doc("Inter Company Stock Transfer")
        
        stock_transfer.template = stock_transfer_template

        stock_transfer.inter_company_material_request = self.name

        
        for item in self.get("items"):
            stock_transfer.append("item_details", {
                "item_code": item.item_code,
                "item_name": item.item_name,
                "qty": item.qty
            })
        
        stock_transfer.insert()
        stock_transfer.submit()

        
#     def on_submit(self):
#         create_material_requests(self)

# def create_material_requests(doc):
#     """
#     Create Material Requests grouped by supplier from the Inter Company Material Request.
#     """
#     supplier_items_map = {}
#     for item in doc.items: 
#         if not item.supplier:
#             frappe.throw(f"Supplier is missing for item {item.item_code}. Please provide a valid supplier.")
        
#         if item.supplier not in supplier_items_map:
#             supplier_items_map[item.supplier] = []
#         supplier_items_map[item.supplier].append(item)

#     for supplier, items in supplier_items_map.items():
#         supplier_name = frappe.db.get_value("Supplier", supplier, "supplier_name")
        
#         material_request = frappe.new_doc("Material Request")
#         material_request.update({
#             "company": doc.company,  
#             "internal_supplier": supplier, 
#             "custom_internal_supplier_name": supplier_name, 
#             "material_request_type": "Purchase",
#             "custom_inter_company_material_request": doc.name,
#             "set_warehouse": doc.set_warehouse,
#             "items": []
#         })

#         for item in items:
#             material_request.append("items", {
#                 "item_code": item.item_code,
#                 "warehouse": doc.set_warehouse,
#                 "qty": item.qty,
#                 "schedule_date": doc.schedule_date or frappe.utils.nowdate()
#             })

#         material_request.save()
#         frappe.msgprint(f"Material Request {material_request.name} created for supplier {supplier} ({supplier_name})")


@frappe.whitelist()
def get_available_qty(item_code):
    """
    Fetch available stock quantity for the given item code.
    """
    warehouses = frappe.db.sql("""
        SELECT
            sle.company AS company,
            sle.item_code AS item_code,
            item.item_name AS item_name,
            sle.warehouse AS warehouse,
            SUM(sle.actual_qty) AS actual_qty
        FROM
            `tabStock Ledger Entry` sle
        JOIN
            `tabItem` item ON sle.item_code = item.item_code
        WHERE
            sle.item_code = %s
        GROUP BY
            sle.company, sle.item_code, sle.warehouse
        ORDER BY
            sle.company, sle.warehouse
    """, (item_code,), as_dict=True)
    return warehouses
