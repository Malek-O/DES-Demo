import { IPinverse, myArr, PBox, EXPANSION_TABLE, IP_TABLE, hex2bin, IP_inverse, bin2hex, DES, InitialPermuation, expansion, xor, getTheOutputFromSBoxes, P_boxing, dividPlaintextIntoHalves } from '../helpers/DES'
import { sBoxes } from '../helpers/s-boxes'
const MessageGenration = ({ pt, keyM }) => {

    console.log(myArr);
    return (
        <>
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0] whitespace-nowrap  bg-[#DEF1FF]'>Step 6</h1>
                    <h2 className='text-lg'>Permute the message through IP</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Shuffle bits according to the initial permutation IP:</h1>
                    <div className='flex'>
                        <div className="grid grid-cols-8 gap-4">
                            {IP_TABLE.map((item, index) => <div key={index}>{item}</div>)}
                        </div>
                    </div>
                    <div className='my-3'>
                        <h1 className='font-semibold text-lg'>Original message 64-bit:</h1>
                        <h1 className='font-semibold text-lg break-words'>Key: {hex2bin(pt)}</h1>
                    </div>
                    <div className='my-3'>
                        <h1 className=' font-semibold text-lg'>Message after IP  64-bit:</h1>
                        <h1 className=' font-semibold text-lg break-words'>Key: {InitialPermuation(hex2bin(pt))}</h1>
                    </div>
                </div>
            </section>
            <hr className='mt-10' />

            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0] whitespace-nowrap bg-[#DEF1FF]'>Step 7</h1>
                    <h2 className='text-lg'>Encode the data</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Splitting the resulting message into two halves:</h1>
                    <div>
                        <h1 className='my-3 font-semibold text-lg break-words'>L0 :{dividPlaintextIntoHalves(InitialPermuation(hex2bin(pt)), 32).LHS}</h1>
                        <h1 className='my-3  font-semibold text-lg break-words'>R0 :{dividPlaintextIntoHalves(InitialPermuation(hex2bin(pt)), 32).RHS}</h1>
                    </div>
                    <div className='my-3 font-semibold text-base'>
                        <p>
                            This can be expanded to 16 entries using the following formula
                            Ln = Rn - 1
                            Rn = Ln - 1 ⊕ f(Rn - 1, Kn)

                            Where f = P(S(Kn ⊕ E(Rn))), where E expands 32 bits into 48 bits using the following table:
                        </p>
                    </div>
                    <div className='flex'>
                        <div className="grid grid-cols-6 gap-4">
                            {EXPANSION_TABLE.map((item, index) => <div key={index}>{item}</div>)}
                        </div>
                    </div>
                    <h1 className='mt-10 font-semibold'>
                        Then S splits the 48 bits into eight groups of six bits, and each group gets ran through the S-box as follows:
                    </h1>
                    <div>
                        {sBoxes.map((item, index) => {
                            return (
                                <div key={index} className='overflow-x-auto' >
                                    <h1 className='text-center mt-5'>S{index + 1}</h1>
                                    <table className='mx-auto border-collapse border border-slate-500 mb-5'>
                                        <tbody>
                                            {item.map((item, index) => {
                                                return (
                                                    <tr key={index} className='border border-slate-600'>
                                                        {item.map((item, index) => {
                                                            return (
                                                                <td key={index} className='border px-3 border-slate-600'>{item}</td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <h1 className='mt-10 font-semibold'>
                    Then finally, P mixes up the 32-bit output to get the output of f, using the following table:
                </h1>
                <div className='flex'>
                    <div className="grid grid-cols-4 gap-4">
                        {PBox.map((item, index) => <div key={index}>{item}</div>)}
                    </div>
                </div>
                <div className='my-5 font-semibold text-base'>
                    <h1>Using the formula described previously:</h1>
                    <h1>Ln = Rn - 1</h1>
                    <h1>Rn = Ln - 1 ⊕ f(Rn - 1, Kn) where f = S(Kn ⊕ E(Rn)),
                    </h1>
                    <h1>We apply them iteratively in a series of rounds.</h1>
                </div>
            </section>

            <hr className='mt-10' />
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0] whitespace-nowrap bg-[#DEF1FF]'>Step 8</h1>
                    <h2 className='text-lg'>Computing ROUNDS</h2>
                </div>
                <div>
                    {myArr?.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className='mt-10 flex items-center gap-3 my-5'>
                                    <h1 className='p-2 font-bold rounded-md text-amber-800  bg-amber-300'>Round {index + 1}</h1>
                                </div>
                                <div className='p-5 rounded-md shadow-lg'>
                                    <h1 className='break-words'>L{index} = {item.lprev}</h1>
                                    <h1 className='break-words'>R{index} = {item.rprev}</h1>
                                    <h1 className='mb-5 break-words'>K{index} = {item.key}</h1>
                                    <h1 className='break-words'>E(R{index}) = {item.expandedRHS}</h1>
                                    <h1 className='break-words'>K1 ⊕ E(R{index})  = {item.xoredValueWithKey}</h1>
                                    <h1 className='break-words'>S(K1 ⊕ E(R{index}))  = {item.PtFromSBox}</h1>
                                    <h1 className='break-words'>f = P(S(K1 ⊕ E(R{index})))   = {item.PtFromPbox}</h1>
                                    <h1 className='mt-5 break-words'>L{index + 1} = {item.lCurr}</h1>
                                    <h1 className='break-words'>R{index + 1} = {item.rCurr}</h1>


                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
            <hr className='mt-10' />
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0] whitespace-nowrap  bg-[#DEF1FF]'>Step 9</h1>
                    <h2 className='text-lg'>Permute the encoded data through the IP-1 table</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Now that we have:</h1>
                    <h1 className=' font-semibold text-lg break-words'>L16 = R15 = {myArr[15].lCurr}</h1>
                    <h1 className=' font-semibold text-lg break-words'>R16 = L15 ⊕ f(R15, K16) =  {myArr[15].rCurr}</h1>
                    <h1 className='my-5 font-semibold text-lg'>Concatenate them backwards to get:</h1>
                    <h1 className='my-5 font-semibold text-lg break-words'>R16L16 = {myArr[15].rCurr + myArr[15].lCurr}</h1>
                    <h1 className='my-5 font-semibold text-lg'>Then re-shuffle R16L16 using the following IP-1 table:</h1>
                    <div className='flex'>
                        <div className="grid grid-cols-8 gap-4">
                            {IPinverse.map((item, index) => <div key={index}>{item}</div>)}
                        </div>
                    </div>
                    <h1 className='font-semibold text-lg mt-5 break-words'>To get: {myArr[15].ipInverse}</h1>
                    <h1 className='font-semibold text-lg mt-5'>Converting it to hexadecimal yields the cipherText:</h1>
                    <h1 className='p-2  mt-5 w-full md:w-[250px] rounded-md text-center bg-red-300 text-red-800 mx-auto'>{myArr[15].cipherText}</h1>
                </div>
            </section>
            <hr className='mt-10' />
        </>
    )
}

export default MessageGenration