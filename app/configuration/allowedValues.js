import { load } from "js-yaml";

//const IP_REGEX = /^[0-9.]*$/;
const IP_REGEX = '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';

const FQDN_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const conf = {
    fqdn: {
        type: 'text',
        placeholder: 'Enter FQDN',
        required: true,
        regex: FQDN_REGEX,
        allowedCharacters: new RegExp('^[a-zA-Z0-9.]+$')
    },
    applicationGroup: {
        type: 'text',
        placeholder: 'Enter Application Group',
        required: false,
        textCase: 'unchanged'
    },
    adminState: {
        type: 'bool',
        required: false,
        advanced: true
    },
    virtualAddress: {
        type: 'text',
        placeholder: 'Enter Virtual Address',
        required: true,
        regex: IP_REGEX,
        notes: 'match ip regex',
        allowedCharacters: /^[0-9.]*$/
    },
    virtualPort: {
        type: 'integer',
        placeholder: 'Enter Virtual Port',
        required: true,
        min: 0,
        max: 65535
    },
    defaultPool: {
        type: 'select',
        placeholder: 'Enter Default Pool',
        options: 'pools',
        required: false,
        advanced: true,
    },
    trafficGroup: {
        type: 'select',
        options: {
            'Traffic Group 1 ': 'traffic-group-1',
            'Traffic Group 2 ': 'traffic-group-2',
            'Traffic Group 3 ': 'traffic-group-3'
        },
        placeholder: 'Enter Default Pool',
        required: false,
        notes: '',
    },
    persistenceMethod: {
        type: 'select',
        options: {
            cookie_unencrypted: 'cookie_unencrypted',
            srcaddr_180: 'srcaddr_180',
            srcaddr_300: 'srcaddr_300',
            srcaddr_600: 'srcaddr_600',
            srcaddr_1800: 'srcaddr_1800',
            srcaddr_3600: 'srcaddr_3600',
            disabled: 'disabled'
        },
        required: false,
        default: 'srcaddr_180'
    },
    profileL4: {
        type: 'select',
        options: {
            300: '300',
            600: '600'
        },
        required: false,
        default: '300',
        note: 'Only FastL4',
        template: ['fastl4']
    },
    remark: {
        type: 'text',
        placeholder: 'Enter Remark',
        required: false,
        maxLength: 64,
        advanced: true
    },
    profileTCP: {
        type: 'select',
        options: {
            300: '300',
            900: '900',
            immediate: 'immediate'
        },
        required: false,
        default: '300',
        note: 'Only for TCP',
        template: ['http', 'https', 'waf']
    },
    profileHTTP: {
        type: 'select',
        options: {
            standard: 'standard',
            decrypted: 'decrypted',
            hsts: 'hsts',
            xff: 'xff'
        },
        required: false,
        default: 'standard',
        note: 'Only for HTTP/HTTPS',
        template: ['http', 'https', 'waf']
    },
    profileTLS: {
        type: 'select',
        options: {
            full: 'full',
            offload: 'offload'
        },
        required: false,
        note: 'Only for template=[https,waf]',
        template: ['https', 'waf']
    },
    policyWAF: {
        type: 'select',
        options: {
            custom: 'custom',
            transparent: 'transparent',
            enforced: 'enforced'
        },
        required: false,
        note: 'Only for template=[waf]',
        template: ['waf']
    },
    pools: {
        type: 'array',
        maxLength: 1,
        noYaml: true,
        options: {
            name: {
                type: 'text',
                placeholder: 'Enter Pool Name',
                required: true,
                defaultName: 'fqdn'
            },
            loadBalancingMode: {
                type: 'select',
                options: {
                    roundRobin: 'round-robin',
                    ratioMember: 'ratio-member',
                    leastConnection: 'least-connection-member'
                },
                placeholder: 'Enter Load Balancing Mode',
                required: false,
                advanced: true
            },
            remark: {
                type: 'text',
                placeholder: 'Enter Remark',
                required: false,
                maxLength: 64,
                advanced: true
            },
            monitor: {
                type: 'object',
                options: {
                    type: {
                        type: 'select',
                        placeholder: 'Enter Monitor Type',
                        options: {
                            http: 'http',
                            tcp: 'tcp',
                            udp: 'udp',
                            icmp: 'icmp'
                        },
                        required: false
                    },
                    receive: {
                        type: 'text',
                        placeholder: 'Enter Receive',
                        required: false
                    },
                    receiveDown: {
                        type: 'text',
                        placeholder: 'Enter Receive Down',
                        required: false,
                        advanced: true
                    },
                    send: {
                        type: 'text',
                        placeholder: 'Enter Send',
                        required: false
                    },
                    targetPort: {
                        type: 'integer',
                        placeholder: 'Enter Target Port',
                        required: false,
                        min: 0,
                        max: 65535
                    },
                    timeUntilUp: {
                        type: 'integer',
                        placeholder: 'Enter Time Until Up',
                        required: false,
                        advanced: true,
                        min: 0,
                        max: 1800
                    }
                }
            },
            members: {
                type: 'array',
                options: {
                    hostname: {
                        type: 'text',
                        placeholder: 'Enter Server Address',
                        required: true,
                        regex: FQDN_REGEX,
                        notes: 'match hostname regex'
                    },
                    adminState: {
                        type: 'select',
                        options: {
                            enable: 'enable',
                            disable: 'disable',
                            offline: 'offline'
                        },
                        required: false
                    },
                    priorityGroup: {
                        type: 'integer',
                        placeholder: 'Enter Priority Group',
                        required: false,
                        min: 0,
                        max: 65535,
                        advanced: true
                    },
                    ratio: {
                        type: 'integer',
                        placeholder: 'Enter Ratio',
                        required: false,
                        min: 1,
                        max: 100,
                        advanced: true
                    },
                    serverAddress: {
                        type: 'text',
                        placeholder: 'Enter Server Address',
                        required: true,
                        regex: IP_REGEX,
                        notes: 'match ip regex'
                    },
                    servicePort: {
                        type: 'integer',
                        placeholder: 'Enter Server Port',
                        required: true,
                        min: 0,
                        max: 65535
                    }
                }
            }
        }
    }
};

export default conf;