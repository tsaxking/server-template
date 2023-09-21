export type Account = {
    id: string;

    username: string;
    key: string;
    salt: string;
    firstName: string;
    lastName: string;
    email:string;
    passwordChange?: string;
    verified: 0 | 1;
    verification?: string;
    emailChange?: string;
    passwordChangeDate?: number;
    created: number;
    phoneNumber: string;
    picture?: string;
}


export type MembershipStatus =
    'pending' |
    'twicePending' |
    'accepted' |
    'rejected' |
    'notAllowed' |
    'notMember';


export type Member = {
    id: string;
    title: string;
    status: 'pending';
    bio: string;
    resume?: string;
}


export type Role = {
    id: string;
    name: string;
    description: string;
    rank: number;
}


export type AccountRole = {
    id: string;
    role: string;
}




export type RolePermission = {
    id: string;
    permission: string;
}


export type Skill = {
    id: string;
    skill: string;
    years: number;
}



export type DiscordLink = {
    id: string;
    discordId: string;
    created: number;
    username: string;
}


export type Permission = 
    "manageMembers" |
    "manageBoard";

export type RoleName = 
    "admin" |
    "developer" |
    "user" | 
    "guest";