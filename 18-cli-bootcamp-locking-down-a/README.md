# CLI Bootcamp: Hardening a Bare Switch from the Console

## Project Summary
Took an out-of-box Cisco 2960 switch from a completely unconfigured state to a hardened management baseline entirely from the CLI: hostname, MOTD banner, hashed enable secret, encrypted console and vty passwords, and a verified, persistent save to NVRAM.

## Topology
2 devices, 1 console link — no data-plane traffic in this lab, since the entire exercise is management-plane hardening on a single switch reached over console.
```
PC --console-- SW1 (unconfigured 2960)
```

## Objectives
- Navigated IOS user EXEC, privileged EXEC, and global configuration modes from a cold console session
- Set a hostname and a MOTD warning banner
- Configured a hashed enable secret plus console and vty passwords with login enforcement
- Enabled service password-encryption and confirmed line passwords were no longer stored in plaintext
- Saved the configuration to NVRAM and verified it would survive a reload
- Read and interpreted show running-config, show version, and show ip interface brief output

## Skills Demonstrated
- IOS CLI mode navigation (user EXEC, privileged EXEC, global configuration)
- Device hardening: enable secret, console/vty line passwords, service password-encryption
- MOTD banner configuration
- Configuration persistence (copy running-config startup-config) and verification
- show-command interpretation for security posture and device state

## Build & Verification
Starting from a console session showing a bare `Switch>` prompt, the switch was renamed, given a MOTD banner, and locked down layer by layer: an enable secret (always hashed regardless of any other setting), then console and vty passwords with `login` explicitly enabled so IOS actually prompts for them, then `service password-encryption` to convert the previously plaintext line passwords to type-7 encoding:

    SW1#show running-config 
    Building configuration...
    
    Current configuration : 1367 bytes
    !
    version 15.0
    no service timestamps log datetime msec
    no service timestamps debug datetime msec
    service password-encryption
    !
    hostname SW1
    !
    enable secret 5 $1$mERr$Pq3/lr0agnISq0fxb9TUZ0
    !
    !
    !
    !
    !
    !
    spanning-tree mode pvst
    spanning-tree extend system-id
    !
    interface FastEthernet0/1
    !
    interface FastEthernet0/2
    !
    interface FastEthernet0/3
    !
    interface FastEthernet0/4
    !
    interface FastEthernet0/5
    !
    interface FastEthernet0/6
    !
    interface FastEthernet0/7
    !
    interface FastEthernet0/8
    !
    interface FastEthernet0/9
    !
    interface FastEthernet0/10
    !
    interface FastEthernet0/11
    !
    interface FastEthernet0/12
    !
    interface FastEthernet0/13
    !
    interface FastEthernet0/14
    !
    interface FastEthernet0/15
    !
    interface FastEthernet0/16
    !
    interface FastEthernet0/17
    !
    interface FastEthernet0/18
    !
    interface FastEthernet0/19
    !
    interface FastEthernet0/20
    !
    interface FastEthernet0/21
    !
    interface FastEthernet0/22
    !
    interface FastEthernet0/23
    !
    interface FastEthernet0/24
    !
    interface GigabitEthernet0/1
    !
    interface GigabitEthernet0/2
    !
    interface Vlan1
     no ip address
     shutdown
    !
    banner motd ^CAuthorized access only. Property of Meridian AV Networks. Disconnect immediately if you are not an authorized technician.^C
    !
    !
    !
    line con 0
     password 7 080243401A160912222B1F177B
     login
    !
    line vty 0 4
     password 7 081758573939160443
     login
    line vty 5 15
     password 7 081758573939160443
     login
    !
    !
    !
    !
    end

Version and interface state were checked next:

    SW1#show version 
    Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4, RELEASE SOFTWARE (fc1)
    Technical Support: http://www.cisco.com/techsupport
    Copyright (c) 1986-2013 by Cisco Systems, Inc.
    Compiled Wed 26-Jun-13 02:49 by mnguyen
    
    ROM: Bootstrap program is C2960 boot loader
    BOOTLDR: C2960 Boot Loader (C2960-HBOOT-M) Version 12.2(25r)FX, RELEASE SOFTWARE (fc4)
    
    Switch uptime is 39 minutes
    System returned to ROM by power-on
    System image file is "flash:c2960-lanbasek9-mz.150-2.SE4.bin"
    
    
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
    
    cisco WS-C2960-24TT-L (PowerPC405) processor (revision B0) with 65536K bytes of memory.
    Processor board ID FOC1010X104
    Last reset from power-on
    1 Virtual Ethernet interface
    24 FastEthernet interfaces
    2 Gigabit Ethernet interfaces
    The password-recovery mechanism is enabled.
    
    64K bytes of flash-simulated non-volatile configuration memory.
    Base ethernet MAC Address       : 00:01:63:2A:8E:19
    Motherboard assembly number     : 73-10390-03
    Power supply part number        : 341-0097-02
    Motherboard serial number       : FOC10093R12
    Power supply serial number      : AZS1007032H
    Model revision number           : B0
    Motherboard revision number     : B0
    Model number                    : WS-C2960-24TT-L
    System serial number            : FOC1010X104
    Top Assembly Part Number        : 800-27221-02
    Top Assembly Revision Number    : A0
    Version ID                      : V02
    CLEI Code Number                : COM3L00BRA
    Hardware Board Revision Number  : 0x01
    
    
    Switch Ports Model              SW Version            SW Image
    ------ ----- -----              ----------            ----------
    *    1 26    WS-C2960-24TT-L    15.0(2)SE4            C2960-LANBASEK9-M
    
    
    Configuration register is 0xF

    SW1#show ip interface brief
    Interface              IP-Address      OK? Method Status                Protocol 
    FastEthernet0/1        unassigned      YES manual down                  down 
    FastEthernet0/2        unassigned      YES manual down                  down 
    FastEthernet0/3        unassigned      YES manual down                  down 
    FastEthernet0/4        unassigned      YES manual down                  down 
    FastEthernet0/5        unassigned      YES manual down                  down 
    FastEthernet0/6        unassigned      YES manual down                  down 
    FastEthernet0/7        unassigned      YES manual down                  down 
    FastEthernet0/8        unassigned      YES manual down                  down 
    FastEthernet0/9        unassigned      YES manual down                  down 
    FastEthernet0/10       unassigned      YES manual down                  down 
    FastEthernet0/11       unassigned      YES manual down                  down 
    FastEthernet0/12       unassigned      YES manual down                  down 
    FastEthernet0/13       unassigned      YES manual down                  down 
    FastEthernet0/14       unassigned      YES manual down                  down 
    FastEthernet0/15       unassigned      YES manual down                  down 
    FastEthernet0/16       unassigned      YES manual down                  down 
    FastEthernet0/17       unassigned      YES manual down                  down 
    FastEthernet0/18       unassigned      YES manual down                  down 
    FastEthernet0/19       unassigned      YES manual down                  down 
    FastEthernet0/20       unassigned      YES manual down                  down 
    FastEthernet0/21       unassigned      YES manual down                  down 
    FastEthernet0/22       unassigned      YES manual down                  down 
    FastEthernet0/23       unassigned      YES manual down                  down 
    FastEthernet0/24       unassigned      YES manual down                  down 
    GigabitEthernet0/1     unassigned      YES manual down                  down 
    GigabitEthernet0/2     unassigned      YES manual down                  down 
    Vlan1                  unassigned      YES manual administratively down down

The configuration was saved to NVRAM and persistence was confirmed independently against startup-config, not just running-config:

    SW1#show startup-config 
    Using 1367 bytes
    !
    version 15.0
    no service timestamps log datetime msec
    no service timestamps debug datetime msec
    service password-encryption
    !
    hostname SW1
    !
    enable secret 5 $1$mERr$Pq3/lr0agnISq0fxb9TUZ0
    !
    !
    !
    !
    !
    !
    spanning-tree mode pvst
    spanning-tree extend system-id
    !
    interface FastEthernet0/1
    !
    interface FastEthernet0/2
    !
    interface FastEthernet0/3
    !
    interface FastEthernet0/4
    !
    interface FastEthernet0/5
    !
    interface FastEthernet0/6
    !
    interface FastEthernet0/7
    !
    interface FastEthernet0/8
    !
    interface FastEthernet0/9
    !
    interface FastEthernet0/10
    !
    interface FastEthernet0/11
    !
    interface FastEthernet0/12
    !
    interface FastEthernet0/13
    !
    interface FastEthernet0/14
    !
    interface FastEthernet0/15
    !
    interface FastEthernet0/16
    !
    interface FastEthernet0/17
    !
    interface FastEthernet0/18
    !
    interface FastEthernet0/19
    !
    interface FastEthernet0/20
    !
    interface FastEthernet0/21
    !
    interface FastEthernet0/22
    !
    interface FastEthernet0/23
    !
    interface FastEthernet0/24
    !
    interface GigabitEthernet0/1
    !
    interface GigabitEthernet0/2
    !
    interface Vlan1
     no ip address
     shutdown
    !
    banner motd ^CAuthorized access only. Property of Meridian AV Networks. Disconnect immediately if you are not an authorized technician.^C
    !
    !
    !
    line con 0
     password 7 080243401A160912222B1F177B
     login
    !
    line vty 0 4
     password 7 081758573939160443
     login
    line vty 5 15
     password 7 081758573939160443
     login
    !
    !
    !
    !
    end

The completed build and verification checks reinforced these outcomes:

- Navigate IOS user EXEC, privileged EXEC, and global configuration modes from the CLI
- Set a hostname and a MOTD banner
- Configure an enable secret, plus console and vty passwords with login
- Enable service password-encryption and verify line passwords are no longer plaintext
- Save configuration with copy running-config startup-config and verify persistence with show startup-config
- Read show running-config, show version, and show ip interface brief output

## Key Configurations

**Hashed enable secret and MOTD banner:**
```
hostname SW1
banner motd #Authorized access only. Property of Meridian AV Networks. Disconnect immediately if you are not an authorized technician.#
enable secret Cisco123!
```

**Console and vty lines, password-protected with login enforced:**
```
line console 0
 password ConsoleP@ss1
 login
line vty 0 15
 password VtyP@ss1
 login
```

**Encrypting line passwords and saving persistently:**
```
service password-encryption
end
copy running-config startup-config
```

## Evidence Package

- NetForge recorded this lab as **passed** on Fri Jul 31 2026.
- Automated score: **6/6 points**.
- [Review the automated grading summary](./evidence/verification/summary.md).
- [Verify artifact hashes](./evidence/manifest.md).

| Artifact | What it proves |
|---|---|
| [locking-down-a-bare-switch.pkt](./evidence/attachments/locking-down-a-bare-switch.pkt) | Reproducible Packet Tracer source |
| [scrn1.png](./evidence/screenshots/scrn1.png) | Learner-captured visual proof |
| [scrn2.png](./evidence/screenshots/scrn2.png) | Learner-captured visual proof |
| [01-pc-bootcamp-show-run-banner.txt](./evidence/verification/01-pc-bootcamp-show-run-banner.txt) | Captured verification output |
| [02-pc-bootcamp-show-run-con.txt](./evidence/verification/02-pc-bootcamp-show-run-con.txt) | Captured verification output |
| [03-pc-bootcamp-show-run-vty.txt](./evidence/verification/03-pc-bootcamp-show-run-vty.txt) | Captured verification output |
| [04-pc-bootcamp-show-version.txt](./evidence/verification/04-pc-bootcamp-show-version.txt) | Captured verification output |
| [05-pc-bootcamp-show-ip-int-brief.txt](./evidence/verification/05-pc-bootcamp-show-ip-int-brief.txt) | Captured verification output |
| [06-pc-bootcamp-show-startup.txt](./evidence/verification/06-pc-bootcamp-show-startup.txt) | Captured verification output |
| [summary.md](./evidence/verification/summary.md) | Automated grading report |

### Evidence Integrity

Automated outputs come from the saved NetForge grading record. Screenshots and optional source files are learner-attached artifacts reviewed before public publication. Expected output is never presented as observed output.

