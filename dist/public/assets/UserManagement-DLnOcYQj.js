import{c as j,r as f,u as p,j as e,I as g,S as A,A as w,C as h,a as v,b as N,d as u,B as i,e as C}from"./index-o98G8oBn.js";import{S as k,T as S,a as T,b as m,c as d,d as y,e as t,D as L,f as E,g as B,h as l}from"./dropdown-menu-BZScIz9n.js";import{E as D}from"./ellipsis-vertical-Dn582aXF.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=j("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]]),U=[{id:1,username:"alex_web3",email:"alex@example.com",walletAddress:"0x742d35Cc6634C0532925a3b844Bc454e4438f44e",trustScore:87,trustLevel:4,isAdmin:!0,createdAt:"2023-09-15T10:30:00Z"},{id:2,username:"crypto_sarah",email:"sarah@example.com",walletAddress:"0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99",trustScore:65,trustLevel:3,isAdmin:!1,createdAt:"2023-10-05T14:20:00Z"},{id:3,username:"blockchain_dev",email:"dev@example.com",walletAddress:"0x3A4e27b5B3A5A2Cc98843De9F2848974C1c05ecB",trustScore:92,trustLevel:5,isAdmin:!0,createdAt:"2023-08-22T09:15:00Z"},{id:4,username:"nft_collector",email:"collector@example.com",walletAddress:"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",trustScore:45,trustLevel:2,isAdmin:!1,createdAt:"2023-11-10T16:45:00Z"},{id:5,username:"defi_guru",email:"guru@example.com",walletAddress:"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",trustScore:78,trustLevel:4,isAdmin:!1,createdAt:"2023-09-30T11:20:00Z"},{id:6,username:"web3_newbie",email:null,walletAddress:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",trustScore:12,trustLevel:1,isAdmin:!1,createdAt:"2024-01-05T08:30:00Z"},{id:7,username:"token_trader",email:"trader@example.com",walletAddress:"0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",trustScore:56,trustLevel:3,isAdmin:!1,createdAt:"2023-12-15T13:10:00Z"},{id:8,username:"dao_voter",email:"voter@example.com",walletAddress:"0x617F2E2fD72FD9D5503197092aC168c91465E7f2",trustScore:34,trustLevel:2,isAdmin:!1,createdAt:"2024-02-20T10:45:00Z"},{id:9,username:"metaverse_builder",email:"builder@example.com",walletAddress:"0x17F6AD8Ef982297579C203069C1DbfFE4348c372",trustScore:81,trustLevel:4,isAdmin:!1,createdAt:"2023-10-12T15:30:00Z"},{id:10,username:"crypto_researcher",email:"research@example.com",walletAddress:"0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678",trustScore:73,trustLevel:3,isAdmin:!1,createdAt:"2023-11-25T09:50:00Z"}];function R(){const[a,c]=f.useState(""),{data:r=[],isLoading:n,error:b}=p({queryKey:["/api/admin/users"],retry:1,initialData:U}),x=r.filter(s=>s.username.toLowerCase().includes(a.toLowerCase())||s.walletAddress.toLowerCase().includes(a.toLowerCase())||s.email&&s.email.toLowerCase().includes(a.toLowerCase()));return n?e.jsx("div",{className:"flex justify-center items-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-10 w-10 border-b-2 border-primary"})}):b?e.jsxs("div",{className:"p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg",children:[e.jsx("h3",{className:"font-semibold",children:"Error Loading Users"}),e.jsx("p",{children:"There was an error loading the user data. Please try again."})]}):e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"User Management"}),e.jsxs("div",{className:"relative w-full md:w-96",children:[e.jsx(k,{className:"absolute left-2 top-2.5 h-4 w-4 text-slate-400"}),e.jsx(g,{placeholder:"Search users by name, email, or wallet address...",className:"pl-8",value:a,onChange:s=>c(s.target.value)})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-6",children:[e.jsx(o,{title:"Total Users",value:r.length,description:"Registered in the system",icon:e.jsx(F,{className:"h-8 w-8 text-blue-500"})}),e.jsx(o,{title:"Verified Users",value:r.filter(s=>s.trustScore>0).length,description:"With trust score > 0",icon:e.jsx(A,{className:"h-8 w-8 text-green-500"})}),e.jsx(o,{title:"Admins",value:r.filter(s=>s.isAdmin).length,description:"With administrative rights",icon:e.jsx(w,{className:"h-8 w-8 text-amber-500"})})]}),e.jsxs(h,{children:[e.jsx(v,{className:"pb-2",children:e.jsx(N,{children:"User List"})}),e.jsx(u,{children:e.jsxs(S,{children:[e.jsx(T,{children:e.jsxs(m,{children:[e.jsx(d,{children:"User"}),e.jsx(d,{children:"Wallet Address"}),e.jsx(d,{children:"Trust Score"}),e.jsx(d,{children:"Status"}),e.jsx(d,{className:"text-right",children:"Actions"})]})}),e.jsx(y,{children:x.length===0?e.jsx(m,{children:e.jsx(t,{colSpan:5,className:"text-center py-6 text-slate-500",children:"No users match your search criteria"})}):x.map(s=>e.jsxs(m,{children:[e.jsx(t,{children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("span",{className:"font-medium",children:s.username}),e.jsx("span",{className:"text-sm text-slate-500",children:s.email||"No email"})]})}),e.jsx(t,{className:"font-mono text-xs",children:`${s.walletAddress.substring(0,6)}...${s.walletAddress.substring(s.walletAddress.length-4)}`}),e.jsx(t,{children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:s.trustScore}),e.jsxs("span",{className:"text-xs text-slate-500",children:["Level ",s.trustLevel]})]})}),e.jsx(t,{children:s.isAdmin?e.jsx(i,{variant:"outline",className:"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30",children:"Admin"}):s.trustScore>50?e.jsx(i,{variant:"outline",className:"bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30",children:"Verified"}):s.trustScore>0?e.jsx(i,{variant:"outline",className:"bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30",children:"Member"}):e.jsx(i,{variant:"outline",className:"bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800/30",children:"New"})}),e.jsx(t,{className:"text-right",children:e.jsxs(L,{children:[e.jsx(E,{asChild:!0,children:e.jsxs(C,{variant:"ghost",size:"icon",children:[e.jsx(D,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Open menu"})]})}),e.jsxs(B,{align:"end",children:[e.jsx(l,{children:"View Profile"}),e.jsx(l,{children:"Edit Trust Score"}),e.jsx(l,{children:"Assign Badge"}),e.jsx(l,{children:"Reset NFT"}),s.isAdmin?e.jsx(l,{className:"text-red-600 dark:text-red-400",children:"Remove Admin"}):e.jsx(l,{className:"text-amber-600 dark:text-amber-400",children:"Make Admin"})]})]})})]},s.id))})]})})]})]})}function o({title:a,value:c,description:r,icon:n}){return e.jsx(h,{children:e.jsx(u,{className:"pt-6",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium text-slate-500 dark:text-slate-400",children:a}),e.jsx("p",{className:"text-2xl font-bold",children:c}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:r})]}),e.jsx("div",{className:"bg-slate-100 dark:bg-slate-800 p-2 rounded-lg h-fit",children:n})]})})})}export{R as default};
