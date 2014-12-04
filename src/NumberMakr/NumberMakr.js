/**
 * An updated version of the traditional MersenneTwister JavaScript class by 
 * Sean McCullough (2010), based on code by Takuji Nishimura and Makoto 
 * Matsumoto (1997 - 2002).
 * 
 * For the 2010 code, see https://gist.github.com/banksean/300494.
 *
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/
/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/
function NumberMakr(settings) {
    "use strict";
    if (!this || this === window) {
        return new NumbrMakr(settings);
    }
    var self = this,
        
        // Number length of the state vector
        N,
        
        // Number period
        M,
        
        // Constant vector a
        MATRIX_A, 
        
        // Most significant w-r bits
        UPPER_MASK,
        
        // Least significant r bits
        LOWER_MASK,
        
        // Array for the state vector
        mt,
        
        // Number for place in state vector (if === N + 1, not initialized yet)
        mti,
        
        // The starting seed used to initialize. This may be a Number or Array.
        seed = 0;
    
    /**
     * 
     */
    self.reset = function (settings) {
        N = settings.N || 624;
        M = settings.M || 397;
        MATRIX_A = settings.MATRIX_A || 0x9908b0df;
        UPPER_MASK = settings.UPPER_MASK || 0x80000000;
        LOWER_MASK = settings.LOWER_MASK || 0x7fffffff;
        
        mt = new Array(N);
        mti = N + 1;
        
        self.resetFromSeed(settings.seed || new Date().getTime());
    };
    
    /**
     * 
     */
    self.getSeed = function () {
        return seed;
    };
    
    /**
     * Initializes state from a Number.
     * 
     * @param {Number} [seedNew]   Defaults to the previously set seed.
     */
    self.resetFromSeed = function (seedNew) {
        var s;
        
        if (typeof(seedNew) === "undefined") {
            seedNew = seed;
        }
        
        mt[0] = seedNew >>> 0;
        
        for (mti = 1; mti < N; mti += 1) {
            s = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
            // mt[this.mti] = ((
                // ((((s & 0xffff0000) >>> 16) * 1812433253) << 16)
                // + (s & 0x0000ffff) * 1812433253)
                // + this.mti
            // ) >> 0;
            mt[mti] = (
                (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) 
                    + (s & 0x0000ffff) * 1812433253)
                    + mti
            ) >>> 0;
        }
        
        seed = seedNew;
    };
    
    /**
     * Initializes state from an Array.
     * 
     * @param {Number[]} init_key
     * @param {Number} [key_length]   The length of init_key (defaults to the
     *                                actual init_key.length).
     * @remarks   There was a slight change for C++, 2004/2/26.
     */
    self.resetFromArray = function (init_key, key_length) {
        var i = 1,
            j = 0, 
            k,
            s;
        
        self.resetFromSeed(19650218);
        
        if (typeof(key_length) === "undefined") {
            key_length = init_key.length;
        }
        k = N > key_length ? N : key_length;
        
        while(k > 0) {
            s = mt[i - 1] ^ (mt[i - 1] >>> 30);
            mt[i] = (this.mt[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1664525) << 16)
                    + ((s & 0x0000ffff) * 1664525)
                ) + init_key[j] + j
            ) >>> 0;
            
            i += 1;
            j += 1;
            
            if (i >= N) {
                mt[0] = mt[N - 1];
                i = 1;
            }
            
            if (j >= key_length) {
                j = 0;
            }
        }
        
        for (k = N - 1; k; k -= 1) {
            s = mt[i-1] ^ (mt[i-1] >>> 30);
            mt[i] = ((mt[i] ^ (
                    ((((s & 0xffff0000) >>> 16) * 1566083941) << 16) 
                    + (s & 0x0000ffff) * 1566083941)
                ) - i
            ) >>> 0;
            
            i += 1;
            
            if (i >= N) {
                mt[0] = mt[N - 1];
                i = 1;
            }
        }
        
        mt[0] = 0x80000000;
        seed = init_key;
    };
    
    
    /* Random number generation
    */
    
    /**
     * @return {Number} Random Number in [0,0xffffffff].
     */
    self.randomInt32 = function () {
        var mag01 = new Array(0x0, MATRIX_A),
            y, kk;
        
        if (mti >= N) {
            if (mti === N + 1) {
                self.resetFromSeed(5489);
            }
            
            for (kk = 0; kk < N - M; kk += 1) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            
            for (; kk < N - 1; kk += 1) {
                y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
                mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            
            y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
            mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            mti = 0;
        }
        
        y = mt[mti];
        mti += 1;
        
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    };
    
    /**
     * @return {Number} Random number in [0,1).
     * @remarks Divided by 2^32.
     */
    self.random = function () {
        return self.randomInt32() * (1.0 / 4294967296.0); 
    };
    
    /**
     * @return {Number} Random Number in [0,0x7fffffff].
     */
    self.randomInt31 = function () {
        return self.randomInt32() >>> 1;
    };
    
    
    /* Real number generators (due to Isaku Wada, 2002/01/09)
    */
    
    /**
     * @return {Number} Random real Number in [0,1].
     * @remarks Divided by 2 ^ 32 - 1.
     */
    self.randomReal1 = function () {
        return self.randomInt32() * (1.0 / 4294967295.0); 
    };
    
    /**
     * @return {Number} Random real Number in (0,1).
     * @remarks Divided by 2 ^ 32.
     */
    self.randomReal3 = function () {
        return (self.randomInt32() + 0.5) * (1.0 / 4294967296.0); 
    };
    
    /**
     * @return {Number} Random real Number in [0,1) with 53-bit resolution.
     */
    self.randomReal53Bit = function () {
        var a = self.randomInt32() >>> 5,
            b = self.randomInt32() >>> 6; 
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0); 
    };
    
    
    /* Ranged Number generators
    */
    
    /**
     * @param {Number} max
     * @return {Number} Random Number in [0,max).
     */
    self.randomUnder = function (max) {
        return self.random() * max;
    };
    
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random Number in [min,max).
     */
    self.randomWithin = function (min, max) {
        return self.random(max - min) + min;
    };
    
    
    /* Ranged integer generators
    */
    
    /**
     * @param {Number} max
     * @return {Number} Random integer in [0,max).
     */
    self.randomInt = function (max) {
        return self.randomUnder(max) | 0;
    };
    
    /**
     * @param {Number} min
     * @param {Number} max
     * @return {Number} Random integer in [min,max).
     */
    self.randomIntWithin = function (min, max) {
        return self.randomWithin(max - min) + min;
    }
    
    
    self.reset(settings || {});
}