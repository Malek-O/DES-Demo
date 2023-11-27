import React from 'react'
import { useEffect, useState } from 'react'
import { PC1, PC2, hex2bin, PermuatedChoice1, diviedKeyIntoHalves, PerfromLCSonKeysFor16Rounds, perfromPC2 } from '../helpers/key'
import PC1Table from './PC1Table'

const KeyGenration = ({ pt, keyM }) => {

    const [keysAfterRotate, setKeysAfterRotate] = useState(null)

    const handleLCS = () => {
        const permuatedcoice1key = PermuatedChoice1(PC1, hex2bin(keyM))
        const dividedKey = diviedKeyIntoHalves(permuatedcoice1key, 28)
        const keysAfterLeftCircularShift = PerfromLCSonKeysFor16Rounds(dividedKey)
        setKeysAfterRotate(keysAfterLeftCircularShift)
    }

    useEffect(() => {
        handleLCS()
    }, [pt, keyM])

    return (
        <>
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 0</h1>
                    <h2 className='text-lg'>Initialization</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg '>Message: {pt}</h1>
                    <h1 className='my-5 font-semibold text-lg'>Key: {keyM}</h1>
                </div>
            </section>
            <hr className='mt-10' />

            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 1</h1>
                    <h2 className='text-lg'>Convert to binary</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg break-words'>Message in binary 64-bit: {hex2bin(pt)}</h1>
                    <h1 className='my-5 font-semibold text-lg break-words'>Key: {hex2bin(keyM)}</h1>
                </div>
            </section>
            <hr className='mt-10' />

            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>

                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 2</h1>
                    <h2 className='text-lg'>Permute the key through the PC-1 table</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Shuffle bits according to PC-1:</h1>
                    <div className='flex'>
                        <div className="grid grid-cols-7 gap-4">
                            {PC1.map((item, index) => <div key={index}>{item}</div>)}
                        </div>
                    </div>
                    <h1 className='my-5 font-semibold text-lg'>Key after PC-1 56-bit:</h1>
                    <h1 className='my-5 font-semibold text-lg break-words'>{PermuatedChoice1(PC1, hex2bin(keyM))}</h1>
                </div>
            </section>
            <hr className='mt-10' />
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 3</h1>
                    <h2 className='text-lg'> Rotating each half</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Split the key in half, then left rotate each according to the table:</h1>
                    <PC1Table />
                    <div className='mt-5'>
                        {keysAfterRotate?.map((item) => {
                            return (
                                <div className='my-2' key={item.index}>
                                    <h1 className='break-words'>C{item.index}: {item.LHS}</h1>
                                    <h1 className='break-words'>D{item.index}: {item.RHS}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <hr className='mt-10' />
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 4</h1>
                    <h2 className='text-lg'>Concatenation</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Concatenate C and D:</h1>
                    <div className='mt-5'>
                        {keysAfterRotate?.map((item) => {
                            return (
                                <div className='my-2' key={item.index}>
                                    <h1 className='break-words'>CD{item.index}: {item.LHS + item.RHS}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <hr className='mt-10' />
            <section>
                <div className='mt-10 flex items-center gap-3 my-5'>
                    <h1 className='p-2 font-bold rounded-md text-[#0A71D0]  bg-[#DEF1FF]'>Step 5</h1>
                    <h2 className='text-lg'>Permute the key through the PC-2 table</h2>
                </div>
                <div>
                    <h1 className='my-5 font-semibold text-lg'>Shuffle bits according to PC-2 48-bit:</h1>
                    <div className='flex'>
                        <div className="grid grid-cols-6 gap-4">
                            {PC2.map((item, index) => <div key={index}>{item}</div>)}
                        </div>
                    </div>
                    <h1 className='my-5 font-semibold text-lg'>Key after PC-2 48-bit:</h1>
                    <div className='my-5 font-semibold text-lg'>
                        {keysAfterRotate &&
                            perfromPC2(keysAfterRotate).map((item) => {
                                return (
                                    <h1 className='break-words' key={item.index}>K{item.index} = {item.key}</h1>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
            <hr className='mt-10' />

        </>


    )
}

export default KeyGenration