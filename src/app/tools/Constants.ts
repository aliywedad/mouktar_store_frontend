import { Administrateur } from './Administrateur';

export class Constants {
  static authAdmin: any | null;
  static admin: Administrateur | null;
  static route: string;
  static imgsrc: string = 'assets/images/user/anonymous.png';
  static readonly imageStorageRef = '/Admins/images/';
  static redirect = false;
  static URLS: any;
}
//  const apiUrl = environment.API_URL;
//  export const agencies = environment.AGENTS;

export class URLS {
  static serverPath = 'https://mouktar.karnty.com/';
  // static serverPath = 'http://127.0.0.1:8000/';
   
  // 
  static facteurs = URLS.serverPath + 'facteurs/';
  static uploadAPI = URLS.serverPath + 'api/upload/';
  static getDebtsByPhone = URLS.serverPath + 'getDebtsByPhone/';
  static confirmeFacteur = URLS.serverPath + 'confirmeFacteur/';
  static clients = URLS.serverPath + 'clients/';
  static notes = URLS.serverPath + 'notes/';
  static debts = URLS.serverPath + 'debts/';
  static prods = URLS.serverPath + 'products/';




















  static backup = 'send_backup/';

  static getAdminByUID = URLS.serverPath + 'getAdminByUID';
  static send_pdf = URLS.serverPath + 'send-pdf/';
  
  static getTodayTransactions = URLS.serverPath + 'getTodayTransactions/';
  static sendTodayBalance = URLS.serverPath + 'sendTodayBalance/';
  static Tenzil_le7sab = URLS.serverPath + 'Tenzil_le7sab/';

  static augmantTreasury = URLS.serverPath + 'augmantTreasury/';
  static cancel_transactions = URLS.serverPath + 'cancel_transactions/';
  static delete_day = URLS.serverPath + 'delete_day/';
  static getDays = URLS.serverPath + 'getDays/';

  static updateAdminProfile = URLS.serverPath + 'updateAdminProfile';
  static getAllRoles = URLS.serverPath + 'getAllRoles';
  static hello = URLS.serverPath + 'hello/';
  static get_employee_transactions =
    URLS.serverPath + 'get_employee_transactions/';

  static login = URLS.serverPath + 'login/';
  static addEmployeeTrans = URLS.serverPath + 'addEmployeeTrans/';

  static getUserInfoById = URLS.serverPath + 'getUserInfoById/';
  // static agency_remaining_days = URLS.serverPath + 'agency_remaining_days/';
  
  static users = URLS.serverPath + 'api/users/';
  static products = URLS.serverPath + 'api/products/';
  static days = URLS.serverPath + 'api/days/';
  static getTransactionsByDay = URLS.serverPath + 'getTransactionsByDay/';


  static add_products = URLS.serverPath + 'add_products/';
  static supplier = URLS.serverPath + 'api/suppliers/';
  static suppliersDebts = URLS.serverPath + 'api/SuppliersDebts/';

  static sales = URLS.serverPath + 'api/sales/';
  static filter_sales = URLS.serverPath + 'filter_sales/';
  static sales_stats = URLS.serverPath + 'sales_stats/';
  static CancelSale = URLS.serverPath + 'CancelSale/';

  static transaction = URLS.serverPath + 'api/transactions/';
  static add_new_transaction = URLS.serverPath + 'add_new_transaction/';
  
  static employees = URLS.serverPath + 'api/employees/';
  static salary = URLS.serverPath + 'api/salary/';
  static get_transactions = URLS.serverPath + 'get_transactions/';
  static sendBackup = URLS.serverPath + 'send_backup/';
  static getSalaryByEmployee = URLS.serverPath + 'getSalaryByEmployee/';

  static treasury = URLS.serverPath + 'api/treasury/';
  static last_treasury = URLS.serverPath + 'last_treasury/';
  static total_suppliers =
    URLS.serverPath + 'get_total_supplires_balance_balance/';
  static total_debts = URLS.serverPath + 'get_total_debts_balance/';
  static sendTodayBenefits = URLS.serverPath + 'sendTodayBenefits/';
  static total_deposits = URLS.serverPath + 'get_total_deposits_balance/';
  static deprecated = URLS.serverPath + 'deprecated/';
  static getAgencies = URLS.serverPath + 'getAgencies/';

  static last_backup = URLS.serverPath + 'last_backup/';
  static casher = URLS.serverPath + 'casher/';
  static registerSales = URLS.serverPath + 'registerSales/';
  static registerSales_debt = URLS.serverPath + 'registerSales_debt/';

  static deposit = URLS.serverPath + 'deposit_to_treasury/';
  static Debts = URLS.serverPath + 'api/debts/';
  static Deposits = URLS.serverPath + 'api/deposit/';
  static searchByPhoneNumber = URLS.serverPath + 'searchByPhoneNumber/';
  static get_phones = URLS.serverPath + 'get_phones/';

  static debtsPayment = URLS.serverPath + 'api/debtsPayment/';
  static SuppliersDebtsPayment = URLS.serverPath + 'api/SuppliersDebtsPayment/';
  static depositsPayment = URLS.serverPath + 'api/depositsPayment/';
  static getPaymentByDebt = URLS.serverPath + 'getPaymentByDebt/';
  static getPaymentBySupplierDebt =
    URLS.serverPath + 'getPaymentBySupplierDebt/';
  static getPaymentByDeposits = URLS.serverPath + 'getPaymentByDeposits/';
}

export class RolesId {
  static dashBoad = 'consulter-dashboard';
  static profile_admin = 'profile-admin';
}

export const roles_list = [
  'dashboard',
  'casher',
  'users',
  'products',
  'sales',
  'transactions',
  'treasury',
  'admin',
  'debts',
  'deposits',
  'backup',
  'suppliers',
  'supplierDebts',
  'employees',
];

// export const agencies = ['Agent Elvirdows', 'Agent El-itihadiya','Agent El-itihadiya 2'];
// export const agencies = ['Agent Baneblance'];
export const roles: any = {
  dashboard: 'لوحة التحكم',
  casher: 'نقطة البيع',
  users: 'المستخدمون',
  products: 'المنتجات',
  sales: 'المبيعات',
  transactions: 'المعاملات و الخزينة ',
  admin: 'مدير',
  debts: 'الديون',
  treasury: 'السحب و الإيداع',
  deposits: ' الودائع ',
  backup: 'النسخ الإحتياطي',
  suppliers: 'الموردين',
  supplierDebts: 'مستحقات الموردين',
  employees: 'الموظفين',
};

export const bancks = [
  { label: 'cash', value: 'نقدا' },
  { label: 'bankily', value: 'بنكيلي' },
  { label: 'sedad', value: 'السداد' },
  { label: 'bimBank', value: 'بيم بنك' },
  { label: 'masrivy', value: 'مصرفي' },
  { label: 'click', value: 'كليك' },
  { label: 'debt', value: 'دين' },
];

export const bancks_dics: any = {
  cash: 'نقدا',
  bankily: 'بنكيلي',
  sedad: 'السداد',
  bimBank: 'بيم بنك',
  masrivy: 'مصرفي',
  click: 'كليك',
  debt: 'دين',
};

export const employee_type: any = {
  debt: 'سلفة',
  deposit: 'تسديد دين',
  salary: 'راتب',
  adjustment: 'سلفة',
};
