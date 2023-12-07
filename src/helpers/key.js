const hex2bin = (data) => {
    let hex = data.split('').map(i =>
        parseInt(i, 16).toString(2).padStart(4, '0')).join('');

    if (hex.length < 64) {
        const bitsLeft = 64 - hex.length;
        const zeros = "".padStart(bitsLeft, '0')
        hex += zeros
    }
    return hex
}




const PC1 = [
    "57", "49", "41", "33", "25", "17", "9",
    "1", "58", "50", "42", "34", "26", "18",
    "10", "2", "59", "51", "43", "35", "27",
    "19", "11", "3", "60", "52", "44", "36",
    "63", "55", "47", "39", "31", "23", "15",
    "7", "62", "54", "46", "38", "30", "22",
    "14", "6", "61", "53", "45", "37", "29",
    "21", "13", "5", "28", "20", "12", "4"
];

const PC2 = [
    '14', '17', '11', '24', '1', '5',
    '3', '28', '15', '6', '21', '10',
    '23', '19', '12', '4', '26', '8',
    '16', '7', '27', '20', '13', '2',
    '41', '52', '31', '37', '47', '55',
    '30', '40', '51', '45', '33', '48',
    '44', '49', '39', '56', '34', '53',
    '46', '42', '50', '36', '29', '32'
];


// this will reduce the key into 56 bits , 
function PermuatedChoice1(PC1, key) {
    let Perumatedtext = "";
    PC1.forEach(element => {
        Perumatedtext += key.charAt(element - 1)
    });
    return Perumatedtext
}

// this will divide the key into two halfs
function diviedKeyIntoHalves(key, position) {
    const firstPart = key.substring(0, position);
    const secondPart = key.substring(position);
    return { LHS: firstPart, RHS: secondPart };
}

// this function will take the divided key and left circualr shift it according to the times eg. 1, 2
function LeftCircularShift(dividedKey, times) {
    const halveKey = dividedKey;
    let NewBitsAfterLCS = ''
    let shiftedBits = []
    for (let i = 0; i < halveKey.length; i++) {
        if (i >= times) {
            NewBitsAfterLCS += halveKey[i]
        } else {
            shiftedBits.push(halveKey[i])
        }
    }
    shiftedBits.forEach(element => {
        NewBitsAfterLCS += element
    });
    return NewBitsAfterLCS
}

// this function will take the keys and perform the LCS on it for 16 round
function PerfromLCSonKeysFor16Rounds(key) {
    const LHS = key.LHS;
    const RHS = key.RHS;
    let keysAfterLeftCircularShift = [
        { index: 0, LHS: LHS, RHS: RHS }
    ];
    for (let i = 0; i < 16; i++) {
        if (i == 0 || i == 1 || i == 8 || i == 15) {
            const left = LeftCircularShift(keysAfterLeftCircularShift[i].LHS, 1);
            const right = LeftCircularShift(keysAfterLeftCircularShift[i].RHS, 1);
            keysAfterLeftCircularShift.push({ index: i + 1, LHS: left, RHS: right })
        } else {
            const left = LeftCircularShift(keysAfterLeftCircularShift[i].LHS, 2);
            const right = LeftCircularShift(keysAfterLeftCircularShift[i].RHS, 2);
            keysAfterLeftCircularShift.push({ index: i + 1, LHS: left, RHS: right })
        }
    }
    return keysAfterLeftCircularShift
}

// this function will take the 56bits, 16 round keys , and recuce it to 48bit 
function perfromPC2(keys) {
    let Perumatedtext = "";
    const PC2Array = []
    for (let i = 0; i < keys.length; i++) {
        if (i !== 0) {
            const fullKey = keys[i].LHS + keys[i].RHS
            PC2.forEach(element => {
                Perumatedtext += fullKey.charAt(element - 1)
            });
            PC2Array.push({ index: i, key: Perumatedtext })
            Perumatedtext = ""
        }
    }
    return PC2Array
}




const Keys = (key) => {
    const permuatedcoice1key = PermuatedChoice1(PC1, hex2bin(key))
    const dividedKey = diviedKeyIntoHalves(permuatedcoice1key, 28)
    const keysAfterLeftCircularShift = PerfromLCSonKeysFor16Rounds(dividedKey)
    const keysAfterPC2 = perfromPC2(keysAfterLeftCircularShift)
    return keysAfterPC2
}

export { PC1, PC2, Keys, hex2bin, PermuatedChoice1, diviedKeyIntoHalves, PerfromLCSonKeysFor16Rounds, perfromPC2 }