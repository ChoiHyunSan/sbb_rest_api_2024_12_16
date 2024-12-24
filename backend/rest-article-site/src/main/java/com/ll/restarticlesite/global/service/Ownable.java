package com.ll.restarticlesite.global.service;

import com.ll.restarticlesite.domain.user.User;

public interface Ownable {
    User getUser();
    Long getId();
}
