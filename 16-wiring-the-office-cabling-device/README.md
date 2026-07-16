# Wiring an Office Closet: Cabling and Device Roles

## Project Summary
Built and verified a small-office wiring closet in Cisco Packet Tracer: a router, two access switches, three PCs, a file server, a wireless access point, and a console-management laptop. The build demonstrates deliberate cable selection, an Auto-MDIX observation, Cisco IOS console access, router-interface activation, static IPv4 addressing, and retained connectivity evidence.

## Topology
9 devices, 8 physical links, one wiring closet:
- **Router1** — ISP demarc handoff with GigabitEthernet0/0 administratively enabled
- **SW1** — primary closet switch, 5 active endpoint ports
- **SW2** — second switch staged for expansion and linked to SW1
- **PC1, PC2, PC3** — end-user workstations
- **Server1** — file server
- **AP1** — wireless access point (wired side only)
- **Laptop** — out-of-band console-access device

```
Laptop --console-- Router1 --straight-through-- SW1 --crossover-- SW2 (staged)
                                                  |-- straight-through -- PC1
                                                  |-- straight-through -- PC2
                                                  |-- straight-through -- PC3
                                                  |-- straight-through -- Server1
                                                  |-- straight-through -- AP1
```

## Objectives
- Placed and cabled a full wiring closet: router, two switches, three PCs, a file server, and an access point
- Applied the classic cable-selection rules for unlike devices, like devices, and console management
- Tested a nonstandard PC-to-switch crossover cable and documented whether Auto-MDIX compensated
- Distinguished an administratively disabled router port from a physical cabling fault
- Used console access and Cisco IOS commands to enable Router1 GigabitEthernet0/0
- Verified end-to-end IPv4 connectivity between wired endpoints

## Skills Demonstrated
- Copper straight-through, crossover, and console cabling
- Auto-MDIX behavior and honest link-light interpretation
- Layer 1 and interface-state troubleshooting
- Cisco IOS user EXEC, privileged EXEC, global configuration, and interface configuration modes
- `no shutdown` and `show ip interface brief`
- Static IPv4 addressing and ICMP connectivity verification

## Build & Verification
The closet was built device-by-device without Packet Tracer's automatic-cable option. A crossover cable was temporarily tested between PC1 and SW1. Its observed behavior was documented in the attached screenshots because an Auto-MDIX-capable port may establish the link even when crossover is not the classic PC-to-switch choice. The link was then recabled with the documented straight-through standard.

Console access into the unconfigured router was confirmed:

    System Bootstrap, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)
    Technical Support: http://www.cisco.com/techsupport
    Copyright (c) 2010 by cisco Systems, Inc.
    Total memory size = 512 MB - On-board = 512 MB, DIMM0 = 0 MB
    CISCO1941/K9 platform with 524288 Kbytes of main memory
    Main memory is configured to 64/-1(On-board/DIMM0) bit mode with ECC disabled
    
    Readonly ROMMON initialized
    
    program load complete, entry point: 0x80803000, size: 0x1b340
    program load complete, entry point: 0x80803000, size: 0x1b340
    
    IOS Image Load Test
    ___________________
    Digitally Signed Release Software
    program load complete, entry point: 0x81000000, size: 0x2bb1c58
    Self decompressing the image :
    ########################################################################## [OK]
    Smart Init is enabled
    smart init is sizing iomem
                      TYPE      MEMORY_REQ
         Onboard devices &
              buffer pools      0x01E8F000
    -----------------------------------------------
                    TOTAL:      0x01E8F000
    Rounded IOMEM up to: 32Mb.
    Using 6 percent iomem. [32Mb/512Mb]
    
                  Restricted Rights Legend
    Use, duplication, or disclosure by the Government is
    subject to restrictions as set forth in subparagraph
    (c) of the Commercial Computer Software - Restricted
    Rights clause at FAR sec. 52.227-19 and subparagraph
    (c) (1) (ii) of the Rights in Technical Data and Computer
    Software clause at DFARS sec. 252.227-7013.
               cisco Systems, Inc.
               170 West Tasman Drive
               San Jose, California 95134-1706
    
    Cisco IOS Software, C1900 Software (C1900-UNIVERSALK9-M), Version 15.1(4)M4, RELEASE SOFTWARE (fc2)
    Technical Support: http://www.cisco.com/techsupport
    Copyright (c) 1986-2012 by Cisco Systems, Inc.
    Compiled Thurs 5-Jan-12 15:41 by pt_team
    Image text-base: 0x2100F918, data-base: 0x24729040
    
    This product contains cryptographic features and is subject to United
    States and local country laws governing import, export, transfer and
    use. Delivery of Cisco cryptographic products does not imply
    third-party authority to import, export, distribute or use encryption.
    Importers, exporters, distributors and users are responsible for
    compliance with U.S. and local country laws. By using this product you
    agree to comply with applicable laws and regulations. If you are unable
    to comply with U.S. and local laws, return this product immediately.
    
    A summary of U.S. laws governing Cisco cryptographic products may be found at:
    http://www.cisco.com/wwl/export/crypto/tool/stqrg.html
    
    If you require further assistance please contact us by sending email to
    export@cisco.com.
    
    Cisco CISCO1941/K9 (revision 1.0) with 491520K/32768K bytes of memory.
    Processor board ID FTX152400KS
    2 Gigabit Ethernet interfaces
    DRAM configuration is 64 bits wide with parity disabled.
    255K bytes of non-volatile configuration memory.
    249856K bytes of ATA System CompactFlash 0 (Read/Write)
    
    
             --- System Configuration Dialog ---
    
    Would you like to enter the initial configuration dialog? [yes/no]: no
    
    
    Press RETURN to get started!
    
    
    
    Router>

Router1 GigabitEthernet0/0 was enabled with `no shutdown`, then checked for an `up up` state:

    Router#show ip interface brief
    Interface              IP-Address      OK? Method Status                Protocol 
    GigabitEthernet0/0     unassigned      YES unset  up                    up 
    GigabitEthernet0/1     unassigned      YES unset  administratively down down 
    Vlan1                  unassigned      YES unset  administratively down down
    Router#

Static IPv4 addresses were assigned to all wired end devices in the 192.168.10.0/24 range. Retained ping output verifies endpoint connectivity through SW1:

    C:\>ping 192.168.10.50
    
    Pinging 192.168.10.50 with 32 bytes of data:
    
    Reply from 192.168.10.50: bytes=32 time<1ms TTL=128
    Reply from 192.168.10.50: bytes=32 time<1ms TTL=128
    Reply from 192.168.10.50: bytes=32 time<1ms TTL=128
    Reply from 192.168.10.50: bytes=32 time<1ms TTL=128
    
    Ping statistics for 192.168.10.50:
        Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
    Approximate round trip times in milli-seconds:
        Minimum = 0ms, Maximum = 0ms, Average = 0ms
    
    C:\>

The completed build and verification checks reinforced these outcomes:

- Place and cable a small office closet: router, two switches, three PCs, a server, and an access point
- Choose the correct cable type for each connection — copper straight-through, copper crossover, and console
- Distinguish an administratively disabled router port from a cabling fault, then enable and verify the port from the Cisco device operating system (Cisco IOS)
- Explain how automatic medium-dependent interface crossover (Auto-MDIX) can make a nonstandard cable work without changing the classic cable-selection rule
- Distinguish device roles (router, switch, server, access point) by the function each one performs
- Use a console cable and the Terminal app to confirm you can reach an unconfigured router

## Key Configurations

**Cable-type decision matrix:**
| Link | Documented cable | Reason |
|---|---|---|
| Router1 <-> SW1 | Copper straight-through | Classic unlike-device rule |
| SW1 <-> SW2 | Copper crossover | Classic like-device rule; Auto-MDIX may also accept straight-through |
| PC / Server / AP <-> SW1 | Copper straight-through | Classic unlike-device rule |
| Laptop <-> Router1 | Console | Out-of-band management |

**Router interface activation:**
```
enable
configure terminal
interface gigabitEthernet0/0
no shutdown
end
show ip interface brief
```

**Static IPv4 addressing (Desktop -> IP Configuration):**
```
PC1:      192.168.10.11 / 255.255.255.0
PC2:      192.168.10.12 / 255.255.255.0
PC3:      192.168.10.13 / 255.255.255.0
Server1:  192.168.10.50 / 255.255.255.0
```

**Console terminal settings:**
```
9600 bps, 8 data bits, no parity, 1 stop bit, no flow control
```

## Evidence Package

- NetForge recorded this lab as **passed** on Thu Jul 16 2026.
- Automated score: **6/6 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [lab2.pkt](./evidence/attachments/lab2.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-cabling-console-prompt.txt](./evidence/verification/01-pc-cabling-console-prompt.txt) | Captured verification output |
| [02-pc-cabling-router-interface-status.txt](./evidence/verification/02-pc-cabling-router-interface-status.txt) | Captured verification output |
| [03-pc-cabling-ipconfig-pc1.txt](./evidence/verification/03-pc-cabling-ipconfig-pc1.txt) | Captured verification output |
| [04-pc-cabling-ipconfig-server1.txt](./evidence/verification/04-pc-cabling-ipconfig-server1.txt) | Captured verification output |
| [05-pc-cabling-ping-server.txt](./evidence/verification/05-pc-cabling-ping-server.txt) | Captured verification output |
| [06-pc-cabling-ping-pc1.txt](./evidence/verification/06-pc-cabling-ping-pc1.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

