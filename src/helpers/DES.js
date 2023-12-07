import { getTheOutputFromSBoxes } from './s-boxes';

const hex2bin = (data) => data.split('').map(i =>
    parseInt(i, 16).toString(2).padStart(4, '0')).join('');

const IP_TABLE =
    ["58", "50", "42", "34", "26", "18", "10", "2",
        "60", "52", "44", "36", "28", "20", "12", "4",
        "62", "54", "46", "38", "30", "22", "14", "6",
        "64", "56", "48", "40", "32", "24", "16", "8",
        "57", "49", "41", "33", "25", "17", "9", "1",
        "59", "51", "43", "35", "27", "19", "11", "3",
        "61", "53", "45", "37", "29", "21", "13", "5",
        "63", "55", "47", "39", "31", "23", "15", "7"
    ];

const EXPANSION_TABLE = [
    '32', '1', '2', '3', '4', '5',
    '4', '5', '6', '7', '8', '9',
    '8', '9', '10', '11', '12', '13',
    '12', '13', '14', '15', '16', '17',
    '16', '17', '18', '19', '20', '21',
    '20', '21', '22', '23', '24', '25',
    '24', '25', '26', '27', '28', '29',
    '28', '29', '30', '31', '32', '1'
];

const PBox = [
    "16", "7", "20", "21", "29", "12", "28", "17", "1", "15", "23", "26", "5", "18", "31", "10",
    "2", "8", "24", "14", "32", "27", "3", "9", "19", "13", "30", "6", "22", "11", "4", "25"
];

const IPinverse = [
    "40", "8", "48", "16", "56", "24", "64", "32",
    "39", "7", "47", "15", "55", "23", "63", "31",
    "38", "6", "46", "14", "54", "22", "62", "30",
    "37", "5", "45", "13", "53", "21", "61", "29",
    "36", "4", "44", "12", "52", "20", "60", "28",
    "35", "3", "43", "11", "51", "19", "59", "27",
    "34", "2", "42", "10", "50", "18", "58", "26",
    "33", "1", "41", "9", "49", "17", "57", "25"
];


// this will divide the message into two halfs
function dividPlaintextIntoHalves(binaryPT, position) {
    const firstPart = binaryPT.substring(0, position);
    const secondPart = binaryPT.substring(position);
    return { LHS: firstPart, RHS: secondPart };
}

// this will take the message and IP it 
function InitialPermuation(binPT) {
    let Perumatedtext = "";
    IP_TABLE.forEach(element => {
        Perumatedtext += binPT.charAt(element - 1)
    });
    return Perumatedtext;
}

// this will take the right halfe of the message and expand it from 32bit into 48bit
function expansion(binPT) {
    let Perumatedtext = "";
    EXPANSION_TABLE.forEach(element => {
        Perumatedtext += binPT.charAt(element - 1)
    });
    return Perumatedtext;
}

// this will xor the key with right half , 48,48
function xor(bin1, bin2) {
    let finalresult = "";
    for (let i = 0; i < bin1.length; i++) {
        const bit1 = parseInt(bin1.charAt(i))
        const bit2 = parseInt(bin2.charAt(i))
        const xored = bit1 ^ bit2;
        finalresult += xored
    }
    return finalresult.toString()
}

// mix the 32bit output 
function P_boxing(binPT) {
    let Perumatedtext = "";
    PBox.forEach(element => {
        Perumatedtext += binPT.charAt(element - 1)
    });
    return Perumatedtext;
}
// this will IP inverse the message
function IP_inverse(binPT) {
    let Perumatedtext = "";
    IPinverse.forEach(element => {
        Perumatedtext += binPT.charAt(element - 1)
    });
    return Perumatedtext;
}


// this will convert the binary to hex cipherText
function bin2hex(bits) {
    const bitSegments = [];
    for (let i = 0; i < bits.length; i += 4) {
        const segment = bits.slice(i, i + 4);
        bitSegments.push(segment);
    }
    let hex = ""
    bitSegments.forEach(element => {
        hex += parseInt(element, 2).toString(16)
    });
    return hex
}


let myArr = []

function DES(pt, keys) {
    myArr = []
    let myObj = {}

    const plaintext = pt

    const binPT = hex2bin(plaintext)
    const PT_IP = InitialPermuation(binPT)

    let dividedPT = dividPlaintextIntoHalves(PT_IP, 32)


    for (let i = 0; i < 16; i++) {

        myObj.lprev = dividedPT.LHS
        myObj.rprev = dividedPT.RHS
        myObj.key = keys[i].key
        myObj.id = i

        let expandedRHS = expansion(dividedPT.RHS)
        myObj.expandedRHS = expandedRHS
        const xoredValueWithKey = xor(expandedRHS, keys[i].key)
        myObj.xoredValueWithKey = xoredValueWithKey
        const PtFromSBox = getTheOutputFromSBoxes(xoredValueWithKey)
        myObj.PtFromSBox = PtFromSBox
        const PtFromPbox = P_boxing(PtFromSBox)
        myObj.PtFromPbox = PtFromPbox

        const lastXoring = xor(dividedPT.LHS, PtFromPbox)
        myObj.lastXoring = lastXoring

        dividedPT = dividedPT.RHS + lastXoring
        dividedPT = dividPlaintextIntoHalves(dividedPT, 32)
        myObj.lCurr = dividedPT.LHS
        myObj.rCurr = dividedPT.RHS


        if (i == 15) {
            const combine = dividedPT.RHS + dividedPT.LHS
            myObj.concatBackwards = combine
            const cipherText = IP_inverse(combine)
            myObj.ipInverse = cipherText
            myObj.cipherText = bin2hex(cipherText)
            myArr.push(myObj)
            myObj = {}
            return bin2hex(cipherText)
        } else {
            myArr.push(myObj)
            myObj = {}
        }
    }
}


export { IPinverse, myArr, PBox, EXPANSION_TABLE, IP_TABLE, hex2bin, IP_inverse, bin2hex, DES, InitialPermuation, expansion, xor, getTheOutputFromSBoxes, P_boxing, dividPlaintextIntoHalves }