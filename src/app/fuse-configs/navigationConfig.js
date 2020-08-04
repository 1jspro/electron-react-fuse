import { authRoles } from "../auth";
import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "DASHBOARD",
    type: "item",
    icon: "dashboard",
    url: "apps/dashboard",
    auth: authRoles.user,
  },
  {
    id: "manage-members",
    title: "Members",
    translate: "MEMBERS",
    type: "item",
    icon: "campaign",
    url: "apps/members",
    // meta: {
    //   permission: "members:read"
    // }
  },

  {
    id: "manage-finance",
    title: "Finance",
    translate: "FINANCE",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "invoices",
        title: "Invoices",
        type: "item",
        url: "apps/invoices",
        meta: {
          permission: "invoices:read",
        },
        end: true,
      },
      {
        id: "expenditure-category",
        title: "Expenditure Categories",
        type: "item",
        url: "apps/expenditure-categories",
        meta: {
          permission: "expenditure-categories:read",
        },
        end: true,
      },
      {
        id: "expenditure",
        title: "Expenditure",
        type: "item",
        url: "apps/expenditure",
        meta: {
          permission: "expenditures:read",
        },
        end: true,
      },
      {
        id: "income-category",
        title: "Income Categories",
        type: "item",
        url: "apps/income-categories",
        meta: {
          permission: "income-categories:read",
        },
        end: true,
      },
      {
        id: "income",
        title: "Income",
        type: "item",
        url: "apps/income",
        meta: {
          permission: "incomes:read",
        },
        end: true,
      },
    ],
  },
  {
    id: "manage-hr",
    title: "HR",
    translate: "HR",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "list-admin",
        title: "Admins",
        type: "item",
        url: "apps/admins",
        meta: {
          permission: "admins:read",
        },
        /* end: true, */
      },
      {
        id: "list-supervisor",
        title: "Supervisors",
        type: "item",
        url: "apps/supervisors",
        meta: {
          permission: "supervisor:read",
        },
        end: true,
      },
      {
        id: "list-education-level",
        title: "Education Levels",
        type: "item",
        url: "apps/education-levels",
        meta: {
          permission: "education-levels:read",
        },
        end: true,
      },
      {
        id: "list-industry",
        title: "Industries",
        type: "item",
        url: "apps/industries",
        meta: {
          permission: "industries:read",
        },
        end: true,
      },
      {
        id: "list-profession",
        title: "Professions",
        type: "item",
        url: "apps/professions",
        meta: {
          permission: "professions:read",
        },
        end: true,
      },

      {
        id: "list-position",
        title: "Positions",
        type: "item",
        url: "apps/positions",
        meta: {
          permission: "positions:read",
        },
        end: true,
      },
      {
        id: "list-groups",
        title: "Group",
        type: "item",
        url: "apps/group",
        meta: {
          permission: "groups:read",
        },
        end: true,
      },

      {
        id: "list-input-field",
        title: "Input Fields",
        type: "item",
        url: "apps/input-fields",
        meta: {
          permission: "input-fields:read",
        },
        end: true,
      },
      {
        id: "list-dynamic-form",
        title: "Dynamic Forms",
        type: "item",
        url: "apps/dynamic-forms",
        meta: {
          permission: "dynamic-forms:read",
        },
        end: true,
      },
      {
        id: "list-id-card",
        title: "Id Cards",
        type: "item",
        url: "apps/id-cards",
        // meta: {
        //   permission: "id-cards:read"
        // },
        end: true,
      },
      {
        id: "list-staff",
        title: "Staff",
        type: "item",
        url: "apps/staff",
        meta: {
          permission: "staffs:read",
        },
        end: true,
      },
      {
        id: "list-executive",
        title: "Executives",
        type: "item",
        url: "apps/executives",
        meta: {
          permission: "executive:read",
        },
        end: true,
      },
      {
        id: "list-elections",
        title: "Elections",
        type: "item",
        url: "apps/elections",
        meta: {
          permission: "elections:read",
        },
        end: true,
      },
      {
        id: "list-projects",
        title: "Projects",
        type: "item",
        url: "apps/projects",
        meta: {
          permission: "projects:read",
        },
        end: true,
      },
      {
        id: "list-events",
        title: "Events",
        type: "item",
        url: "apps/events",
        meta: {
          permission: "events:read",
        },
        end: true,
      },
    ],
  },

  /*{
    id: 'manage-education-levels',
    title: 'Manage Education Levels',
    translate: 'EDUCATIONLEVELS',
    type: 'collapse',
    icon: 'campaign',
    auth: authRoles.superadmin,
    children: [
      {
        id: 'list-education-level',
        title: 'Education Levels',
        type: 'item',
        url: 'apps/education-levels',
        end: true,
      },
      {
        id: 'add-new-education-level',
        title: 'Add Education Level',
        type: 'item',
        url: 'apps/education-levels/new',
        end: true,
      },
    ]
  },*/
  /*{
    id: 'manage-industry',
    title: 'Manage Industry',
    translate: 'INDUSTRY',
    type: 'collapse',
    icon: 'campaign',
    auth: authRoles.superadmin,
    children: [
      {
        id: 'list-industry',
        title: 'Industries',
        type: 'item',
        url: 'apps/industries',
        end: true,
      },
      {
        id: 'add-new-industry',
        title: 'Add Industry',
        type: 'item',
        url: 'apps/industries/new',
        end: true,
      },
    ]
  },*/
  /*{
    id: 'manage-profession',
    title: 'Manage Profession',
    translate: 'PROFESSION',
    type: 'collapse',
    icon: 'campaign',
    auth: authRoles.superadmin,
    children: [
      {
        id: 'list-profession',
        title: 'Professions',
        type: 'item',
        url: 'apps/professions',
        end: true,
      },
      {
        id: 'add-new-profession',
        title: 'Add Profession',
        type: 'item',
        url: 'apps/professions/new',
        end: true,
      },
    ]
  },*/

  {
    id: "manage-asset",
    title: "Manage Asset",
    translate: "Asset",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "asset-category",
        title: "Asset Categories",
        type: "item",
        url: "apps/asset-categories",
        meta: {
          permission: "asset-categories:read",
        },
        end: true,
      },
      {
        id: "asset",
        title: "Asset",
        type: "item",
        url: "apps/asset",
        meta: {
          permission: "assets:read",
        },
        end: true,
      },
    ],
  },

  {
    id: "manage-report",
    title: "Manage Report",
    translate: "Report",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "summary",
        title: "Summary",
        type: "item",
        url: "apps/summary",
        meta: {
          permission: "summary:read",
        },
        end: true,
      },
      {
        id: "communication",
        title: "Communication",
        type: "item",
        url: "apps/communication",
        meta: {
          permission: "communications:read",
        },
        end: true,
      },
    ],
  },

  {
    id: "manage-levels",
    title: "Manage Levels",
    translate: "LEVELS",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "list-levels",
        title: "Levels",
        type: "item",
        url: "apps/levels",
        meta: {
          permission: "levels:read",
        },
        end: true,
      },
      {
        id: "list-level-data",
        title: "Branch Data",
        type: "item",
        url: "apps/level-data",
        meta: {
          permission: "level-data:read",
        },
        end: true,
      },
    ],
  },
  {
    id: "manage-packages",
    title: "Manage Packages",
    translate: "PACKAGES",
    type: "collapse",
    icon: "campaign",
    children: [
      {
        id: "list-package-intervals",
        title: "Package Intervals",
        type: "item",
        url: "apps/package-intervals",
        meta: {
          permission: "package-intervals:read",
        },
        end: true,
      },
      {
        id: "list-packages",
        title: "Packages",
        type: "item",
        url: "apps/packages",
        meta: {
          permission: "packages:read",
        },
        end: true,
      },
    ],
  },

  {
    id: "manage-election",
    title: "Election",
    translate: "Election",
    type: "item",
    url: "apps/electron",
    icon: "campaign",
    auth: authRoles.onlyGuest,
  },
];

export default navigationConfig;
