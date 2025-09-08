package com.example.fcmanager.feature.club.service;

import com.example.fcmanager.feature.address.domain.Address;
import com.example.fcmanager.feature.address.dto.AddressRequestDto;
import com.example.fcmanager.feature.address.mapper.AddressMapper;
import com.example.fcmanager.feature.address.repository.AddressRepository;
import com.example.fcmanager.feature.club.domain.Club;
import com.example.fcmanager.feature.club.dto.ClubResponseDto;
import com.example.fcmanager.feature.club.dto.CreateClubRequestDto;
import com.example.fcmanager.feature.club.dto.UpdateClubRequestDto;
import com.example.fcmanager.feature.club.mapper.ClubMapper;
import com.example.fcmanager.feature.club.repository.ClubRepository;
import com.example.fcmanager.feature.user.domain.User;
import com.example.fcmanager.feature.user.repository.UserRepository;
import com.example.fcmanager.shared.exception.ClubAlreadyExistsException;
import com.example.fcmanager.shared.exception.ClubNotFoundException;
import com.example.fcmanager.shared.exception.UserClubLimitExceededException;
import com.example.fcmanager.shared.exception.UserNotFoundWithIdException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class ClubServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private ClubMapper clubMapper;

    @Mock
    private AddressMapper addressMapper;

    @InjectMocks
    private ClubServiceDefault clubService;

    private Club club;
    private User user;
    private Address address;
    private ClubResponseDto clubResponseDto;
    private CreateClubRequestDto createDto;
    private UpdateClubRequestDto updateDto;
    private AddressRequestDto addressRequestDto;
    private UUID clubId;
    private UUID userId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        clubId = UUID.randomUUID();
        userId = UUID.randomUUID();

        user = new User();
        user.setUserId(userId);
        user.setUsername("testuser");

        address = new Address();
        address.setAddressId(UUID.randomUUID());

        club = new Club();
        club.setClubId(clubId);
        club.setName("Test Club");
        club.setBadge("badge".getBytes());
        club.setUser(user);
        club.setAddress(address);

        clubResponseDto = new ClubResponseDto();
        clubResponseDto.setClubId(clubId);
        clubResponseDto.setName("Test Club");

        addressRequestDto = new AddressRequestDto();

        createDto = new CreateClubRequestDto();
        createDto.setName("New Club");
        createDto.setOwnerId(userId);
        createDto.setAddress(addressRequestDto);

        updateDto = new UpdateClubRequestDto();
        updateDto.setName("Updated Club");
        updateDto.setBadge("newBadge".getBytes());
        updateDto.setFoundedYear(1999);
        updateDto.setStadiumName("New Stadium");
        updateDto.setStadiumCapacity(20000);
        updateDto.setAddress(addressRequestDto);
    }

    @Test
    void shouldReturnAllClubs() {
        Page<Club> clubPage = new PageImpl<>(List.of(club));
        when(clubRepository.findAll(any(Pageable.class))).thenReturn(clubPage);
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        Page<ClubResponseDto> result = clubService.getAllClubs(Pageable.unpaged());

        assertThat(result.getContent()).hasSize(1);
        verify(clubRepository).findAll(any(Pageable.class));
    }

    @Test
    void shouldReturnClubById() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        ClubResponseDto result = clubService.getClubById(clubId);

        assertThat(result).isEqualTo(clubResponseDto);
    }

    @Test
    void shouldThrowWhenClubNotFoundById() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> clubService.getClubById(clubId));
    }

    @Test
    void shouldCreateClubSuccessfully() {
        when(clubRepository.existsByName(createDto.getName())).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(clubRepository.countByUserUserId(userId)).thenReturn(2L);
        when(clubMapper.createClubRequestDtoToClub(createDto)).thenReturn(club);
        when(addressMapper.addressRequestDtoToAddress(addressRequestDto)).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(clubRepository.save(club)).thenReturn(club);
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        ClubResponseDto result = clubService.createClub(createDto);

        assertThat(result).isEqualTo(clubResponseDto);
    }

    @Test
    void shouldThrowWhenClubAlreadyExistsOnCreate() {
        when(clubRepository.existsByName(createDto.getName())).thenReturn(true);

        assertThrows(ClubAlreadyExistsException.class, () -> clubService.createClub(createDto));
    }

    @Test
    void shouldThrowWhenUserNotFoundOnCreate() {
        when(clubRepository.existsByName(createDto.getName())).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundWithIdException.class, () -> clubService.createClub(createDto));
    }

    @Test
    void shouldThrowWhenUserHasTooManyClubs() {
        when(clubRepository.existsByName(createDto.getName())).thenReturn(false);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(clubRepository.countByUserUserId(userId)).thenReturn(5L);

        assertThrows(UserClubLimitExceededException.class, () -> clubService.createClub(createDto));
    }

    @Test
    void shouldUpdateClubSuccessfullyWithExistingAddress() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.existsByName(updateDto.getName())).thenReturn(false);
        when(clubRepository.save(club)).thenReturn(club);
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        ClubResponseDto result = clubService.updateClub(clubId, updateDto);

        assertThat(result).isEqualTo(clubResponseDto);
        verify(addressMapper).updateAddressFromDto(updateDto.getAddress(), club.getAddress());
    }

    @Test
    void shouldUpdateClubSuccessfullyWithNewAddress() {
        club.setAddress(null);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.existsByName(updateDto.getName())).thenReturn(false);
        when(addressMapper.addressRequestDtoToAddress(updateDto.getAddress())).thenReturn(address);
        when(addressRepository.save(address)).thenReturn(address);
        when(clubRepository.save(club)).thenReturn(club);
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        ClubResponseDto result = clubService.updateClub(clubId, updateDto);

        assertThat(result).isEqualTo(clubResponseDto);
        verify(addressMapper).addressRequestDtoToAddress(updateDto.getAddress());
    }

    @Test
    void shouldThrowWhenClubNotFoundOnUpdate() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> clubService.updateClub(clubId, updateDto));
    }

    @Test
    void shouldThrowWhenNewNameAlreadyExistsOnUpdate() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        club.setName("Old Name");
        updateDto.setName("New Name");
        when(clubRepository.existsByName("New Name")).thenReturn(true);

        assertThrows(ClubAlreadyExistsException.class, () -> clubService.updateClub(clubId, updateDto));
    }

    @Test
    void shouldUpdateClubWhenBadgeIsNull() {
        updateDto.setBadge(null);
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.existsByName(updateDto.getName())).thenReturn(false);
        when(clubRepository.save(club)).thenReturn(club);
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        ClubResponseDto result = clubService.updateClub(clubId, updateDto);

        assertThat(result).isEqualTo(clubResponseDto);
    }

    @Test
    void shouldReturnClubBadge() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));

        byte[] result = clubService.getClubBadge(clubId);

        assertThat(result).isEqualTo(club.getBadge());
    }

    @Test
    void shouldThrowWhenClubNotFoundForBadge() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> clubService.getClubBadge(clubId));
    }

    @Test
    void shouldDeleteClubSuccessfully() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        doNothing().when(clubRepository).delete(club);

        clubService.deleteClub(clubId);

        verify(clubRepository).delete(club);
    }

    @Test
    void shouldThrowWhenClubNotFoundOnDelete() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> clubService.deleteClub(clubId));
    }

    @Test
    void shouldGetClubsByOwnerId() {
        when(clubRepository.findByUserUserId(userId)).thenReturn(List.of(club));
        when(clubMapper.toClubDto(club)).thenReturn(clubResponseDto);

        List<ClubResponseDto> result = clubService.getClubsByOwnerId(userId);

        assertThat(result).hasSize(1);
    }

    @Test
    void shouldRemoveClubBadge() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.save(club)).thenReturn(club);

        clubService.removeClubBadge(clubId);

        verify(clubRepository).save(club);
        assertThat(club.getBadge()).isNull();
    }

    @Test
    void shouldThrowWhenClubNotFoundOnRemoveBadge() {
        when(clubRepository.findById(clubId)).thenReturn(Optional.empty());

        assertThrows(ClubNotFoundException.class, () -> clubService.removeClubBadge(clubId));
    }

    @Test
    void updateClub_WhenNameIsTheSame_ShouldNotCheckExistsByName() {
        UUID clubId = UUID.randomUUID();
        Club club = new Club();
        club.setName("SameName");
        club.setAddress(new Address());

        UpdateClubRequestDto dto = new UpdateClubRequestDto();
        dto.setName("SameName");
        dto.setBadge(null);
        dto.setFoundedYear(2000);
        dto.setStadiumName("Old Stadium");
        dto.setStadiumCapacity(5000);
        dto.setAddress(new AddressRequestDto());

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.save(any(Club.class))).thenReturn(club);
        when(clubMapper.toClubDto(any(Club.class))).thenReturn(new ClubResponseDto());

        ClubResponseDto result = clubService.updateClub(clubId, dto);

        assertNotNull(result);
        verify(clubRepository, times(0)).existsByName(anyString());
        verify(clubRepository).save(any(Club.class));
    }

    @Test
    void updateClub_WhenAddressIsNull_ShouldSkipAddressUpdate() {
        UUID clubId = UUID.randomUUID();
        Club club = new Club();
        club.setName("ClubOne");
        club.setAddress(new Address());

        UpdateClubRequestDto dto = new UpdateClubRequestDto();
        dto.setName("ClubOne");
        dto.setBadge(null);
        dto.setFoundedYear(1995);
        dto.setStadiumName("Main Stadium");
        dto.setStadiumCapacity(10000);
        dto.setAddress(null);

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(clubRepository.save(any(Club.class))).thenReturn(club);
        when(clubMapper.toClubDto(any(Club.class))).thenReturn(new ClubResponseDto());

        ClubResponseDto result = clubService.updateClub(clubId, dto);

        assertNotNull(result);
        verify(addressMapper, never()).updateAddressFromDto(any(), any());
        verify(addressRepository, never()).save(any(Address.class));
        verify(clubRepository).save(any(Club.class));
    }
}
