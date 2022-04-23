type allRoles = Array<'Director' |
  'Personnel_Manager' |
  'Accountant' |
  'Security_Officer' |
  'Factory_Manager' |
  'Station_Manager' |
  'Auditor' |
  'Hangar_Take_1' |
  'Hangar_Take_2' |
  'Hangar_Take_3' |
  'Hangar_Take_4' |
  'Hangar_Take_5' |
  'Hangar_Take_6' |
  'Hangar_Take_7' |
  'Hangar_Query_1' |
  'Hangar_Query_2' |
  'Hangar_Query_3' |
  'Hangar_Query_4' |
  'Hangar_Query_5' |
  'Hangar_Query_6' |
  'Hangar_Query_7' |
  'Account_Take_1' |
  'Account_Take_2' |
  'Account_Take_3' |
  'Account_Take_4' |
  'Account_Take_5' |
  'Account_Take_6' |
  'Account_Take_7' |
  'Diplomat' |
  'Config_Equipment' |
  'Container_Take_1' |
  'Container_Take_2' |
  'Container_Take_3' |
  'Container_Take_4' |
  'Container_Take_5' |
  'Container_Take_6' |
  'Container_Take_7' |
  'Rent_Office' |
  'Rent_Factory_Facility' |
  'Rent_Research_Facility' |
  'Junior_Accountant' |
  'Config_Starbase_Equipment' |
  'Trader' |
  'Communications_Officer' |
  'Contract_Manager' |
  'Starbase_Defense_Operator' |
  'Starbase_Fuel_Technician' |
  'Fitting_Manager'>;


export interface IESICharacterRoles {
  roles: allRoles,
  roles_at_base: allRoles,
  roles_at_hq: allRoles,
  roles_at_other: allRoles
}
